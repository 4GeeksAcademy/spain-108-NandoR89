from flask import Blueprint, request, jsonify
from ..models import db, Appointments, Clients, Users, Services, Calendar, Businesses
from ..api_calendar import GoogleCalendarManager
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta, timezone
from sqlalchemy import func

appointments_routes = Blueprint('appointments_routes', __name__)


@appointments_routes.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():

    business_id = request.args.get('business_id')
    query = Appointments.query

    if business_id:
        query = query.filter_by(business_id=business_id)

    appointments = query.all()

    serialized_appointments = [
        appointment.serialize_appointment() for appointment in appointments
    ]

    return jsonify(serialized_appointments), 200


@appointments_routes.route('/appointments/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client_appointments(client_id):
    appointments = Appointments.query.filter_by(client_id=client_id).all()
    if not appointments:
        return jsonify({"error": "appointments not found"}), 404
    return jsonify([appointment.serialize_appointment() for appointment in appointments]), 200


@appointments_routes.route('/appointments', methods=['POST'])
@jwt_required()
def add_appointment():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided in the request"}), 400

    required_fields = [
        "client_email",
        "date_time",
        "username",
        "service_name",
        "business_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"the field {field} is required"}), 400

    try:
        if 'T' in data["date_time"]:
            date_time = datetime.fromisoformat(
                data["date_time"].replace('Z', '+00:00'))
        else:
            date_str = data["date_time"]
            base_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
            date_time = base_date.replace(tzinfo=timezone.utc)

        if date_time < datetime.now(timezone.utc):
            return jsonify({"error": "appointments cannot be scheduled for past dates"}), 400

    except ValueError as e:
        return jsonify({
            "error": f"Invalid date and time format: {str(e)}. Use ISO format (YYYY-MM-DDTHH:MM:SS) or simple format (YYYY-MM-DD HH:MM:SS)"
        }), 400

    client = Clients.query.filter_by(email=data["client_email"]).first()
    if not client:
        return jsonify({"error": "client not found"}), 404

    service = Services.query.filter_by(
        name=data["service_name"]).first()
    if not service:
        return jsonify({"error": "service not found"}), 404

    user = Users.query.filter_by(username=data["username"]).first()
    if not user:
        return jsonify({"error": "user not found"}), 404

    business_id = data["business_id"]
    business = Businesses.query.get(business_id)

    if not business:
        return jsonify({"error": "business not found"}), 404

    date_only = date_time.date()

    appointments_of_day = Appointments.query.filter(
        Appointments.user_id == user.id,
        func.date(Appointments.date_time) == date_only
    ).count()

    MAX_DAILY_APPOINTMENTS = 10

    if appointments_of_day >= MAX_DAILY_APPOINTMENTS:
        return jsonify({
            "error": f"the user already has {MAX_DAILY_APPOINTMENTS} appointments scheduled for this day, daily limit reached"
        }), 409

    existing_user_appointment = Appointments.query.filter_by(
        user_id=user.id,
        date_time=date_time
    ).first()

    if existing_user_appointment:
        return jsonify({"error": "the user already has an appointment scheduled for this date and time"}), 409

    client_appointment = Appointments.query.filter_by(
        client_id=client.id,
        date_time=date_time
    ).first()

    if client_appointment:
        return jsonify({"error": "the client already has an appointment scheduled for this date and time"}), 409

    try:
        new_appointment = Appointments(
            user_id=user.id,
            client_id=client.id,
            service_id=service.id,
            business_id=business_id,
            date_time=date_time,
            status="pending"
        )

        if service not in client.services:
            client.services.append(service)

        db.session.add(new_appointment)
        db.session.commit()

        try:
            client = Clients.query.get(new_appointment.client_id)
            user = Users.query.get(new_appointment.user_id)
            service = Services.query.get(new_appointment.service_id)
            extended_properties = {
                'private': {
                    'businessId': str(new_appointment.business_id),
                    'appointmentId': str(new_appointment.id)
                }
            }
            title = f"Appointment: {client.name} - {service.name}"
            description = f"""
                Client: {client.name}
                Email: {client.email}
                Service: {service.name}
                Attended by: {user.username}
                Status: {new_appointment.status}
            """

            start = new_appointment.date_time.isoformat()
            end = (new_appointment.date_time + timedelta(hours=1)).isoformat()

            calendar_manager = GoogleCalendarManager()
            event = calendar_manager.create_event(
                titulo=title,
                descripcion=description,
                inicio=start,
                fin=end,
                propiedades_extendidas=extended_properties
            )

            if event:
                new_calendar = Calendar(
                    appointment_id=new_appointment.id,
                    start_date_time=new_appointment.date_time,
                    end_date_time=new_appointment.date_time +
                    timedelta(hours=1),
                    google_event_id=event['id'],
                    business_id=new_appointment.business_id,
                    last_sync=datetime.now(timezone.utc)
                )
                db.session.add(new_calendar)
                db.session.commit()

        except Exception as e:
            print(f"Error syncing with Google Calendar: {e}")

        return jsonify({
            "msg": "Appointment registered successfully",
            "appointment": new_appointment.serialize_appointment()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@appointments_routes.route('/appointments/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def update_appointment(appointment_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Data not found"}), 400

    appointment = Appointments.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "appointment not found"}), 404

    if "status" in data:
        appointment.status = data["status"]

    if "service_name" in data:
        service = Services.query.filter_by(
            name=data["service_name"]).first()
        if not service:
            return jsonify({"error": "service not found"}), 404
        appointment.service_id = service.id

    if "username" in data:
        user = Users.query.filter_by(
            username=data["username"]).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        appointment.user_id = user.id

    if "business_id" in data:
        business = Businesses.query.get(data["business_id"])
        if not business:
            return jsonify({"error": "business not found"}), 404
        appointment.business_id = data["business_id"]

    if "date_time" in data:
        try:
            if 'T' in data["date_time"]:
                new_date = datetime.fromisoformat(
                    data["date_time"].replace('Z', '+00:00'))
            else:
                return jsonify({"error": "incorrect date format"}), 400

            if new_date < datetime.now(timezone.utc):
                return jsonify({"error": "appointments cannot be scheduled for past dates"}), 400

            appointment.date_time = new_date
        except ValueError as e:
            return jsonify({
                "error": f"Invalid date and time format: {str(e)}"
            }), 400

    try:
        db.session.commit()

        calendar = Calendar.query.filter_by(
            appointment_id=appointment.id).first()

        if calendar and ("date_time" in data or "service_name" in data or "username" in data or "business_id" in data or "status" in data):
            client = Clients.query.get(appointment.client_id)
            service = Services.query.get(appointment.service_id)
            user = Users.query.get(appointment.user_id)
            business = Businesses.query.get(appointment.business_id)

            if "date_time" in data:
                calendar.start_date_time = appointment.date_time
                calendar.end_date_time = appointment.date_time + \
                    timedelta(hours=1)

            if "business_id" in data:
                calendar.business_id = appointment.business_id

            title = f"Appointment: {client.name} - {service.name}"
            description = f"""
                Client: {client.name}
                Email: {client.email}
                Service: {service.name}
                Attended by: {user.username}
                Status: {appointment.status}
                Business: {business.business_name}
                Business ID: {appointment.business_id}
            """

            start = calendar.start_date_time.isoformat()
            end = calendar.end_date_time.isoformat()

            extended_properties = {
                'private': {
                    'businessId': str(appointment.business_id),
                    'appointmentId': str(appointment.id),
                    'status': appointment.status
                }
            }

            calendar_manager = GoogleCalendarManager()

            updated_data = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start,
                    'timeZone': 'Europe/Madrid',
                },
                'end': {
                    'dateTime': end,
                    'timeZone': 'Europe/Madrid',
                },
                'extendedProperties': extended_properties
            }

            calendar_manager.update_event(
                event_id=calendar.google_event_id,
                updated_data=updated_data
            )

            calendar.last_sync = datetime.now(timezone.utc)
            db.session.commit()

        return jsonify({
            "msg": "appointment updated successfully",
            "appointment": appointment.serialize_appointment()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@appointments_routes.route('/appointments/<int:appointment_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appointment_id):
    appointment = Appointments.query.filter_by(id=appointment_id).first()
    if not appointment:
        return jsonify({"error": "appointment not found"}), 404

    try:
        calendar = Calendar.query.filter_by(
            appointment_id=appointment.id).first()
        if calendar:
            calendar_manager = GoogleCalendarManager()
            calendar_manager.delete_event(calendar.google_event_id)
            db.session.delete(calendar)

        db.session.delete(appointment)
        db.session.commit()

        return jsonify({"msg": "appointment deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
