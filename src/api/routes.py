"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Followers, Characters, Planets, CharacterFavorites, PlanetsFavorites
import requests
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"}
    return response_body, 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None).lower()
    password = request.json.get("password", None)
    # Buscar el email y el password en la BBDD y verificar si is_active es True.
    user = db.session.execute(db.select(Users).where(Users.email == email,
                                                     Users.password == password,
                                                     Users.is_active == True)).scalar()
    if not user:
        response_body['message'] = 'Bad email or password'
        return response_body, 401

    claims = {'user_id': user.serialize()['id'],
              'is_admin': user.serialize()['is_admin']}
    print(claims)
    access_token = create_access_token(identity=email, additional_claims=claims)

    response_body['message'] = 'User logged OK'
    response_body['acees_token'] = access_token
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    additional_claims = get_jwt()
    response_body['current_user'] = current_user
    response_body['additional_data'] = additional_claims
    return response_body, 200


@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'Respuesta del GET'
        # Ejecutando ( SELECT * FROM users )  -- scalars devuelve un iterable (similar a una lista)
        rows = db.session.execute(db.select(Users).where(Users.is_active)).scalars()
        # result = [row.serialize() for row in rows]
        response_body['result'] = [row.serialize() for row in rows]  # list comprehension
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        print(data)
        user = Users()
        user.email = data.get('email', 'user@email.com').lower()
        user.password = data.get('password', '1')
        user.is_active = True
        user.is_admin = True
        user.is_admin = data.get('is_admin', False)
        user.first_name = data.get('first_name', None)
        user.last_name = data.get('last_name', None)
        db.session.add(user)
        db.session.commit()
        response_body['results'] = user.serialize()
        response_body['message'] = 'Respuesta del POST de Users'
    return response_body, 201


@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user(id):
    response_body = {}
    claims = get_jwt()
    print(claims['user_id'])
    print(claims['is_admin'])
    user = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not user:
        response_body['message'] = f'Usuario {id} no encontrado'
        response_body['results'] = {}
        return response_body, 403
    if request.method == 'GET':
        response_body['message'] = f'Usuario {id} encontrado'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'PUT':
        if claims['user_id'] != id:
            response_body['message'] = f'El usuario {claims['user_id']} no tiene permiso para modificar los datos de {id}'
        data = request.json
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        user.is_admin = data.get('is_admin', user.is_admin)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        db.session.commit()
        response_body['message'] = f'Usuario {id} modificado'
        response_body['results'] = user.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        user.is_active = False
        db.session.commit()
        response_body['message'] = f'Usuario {id} eliminado'
        response_body['results'] = None
        return response_body, 200


@api.route('/followers', methods=['POST'])
def follower():
    # Voy a recibir el token del usuario del que sigue (follower)
    follower_id = 9
    response_body = {}
    data = request.json
    if request.method == 'GET':
        followers = db.session.execute(db.select(Followers).where(Followers.follower_id == follower_id)).scalars()
        response_body['results'] = [row.serialize() for row in followers]
        response_body['message'] = f'Listado de followers del usuario {follower_id}'
        for row in followers:
            print(row)
        return response_body, 200
    if request.method == 'POST':
        following_id = data.get('following_id', None)
        following = db.session.execute(db.select(Followers).where((Followers.follower_id == follower_id, Followers.following_id == following_id))).scalar()
        if following:
            response_body['message'] = f'El usuario {follower_id} ya es seguidor del usuario {following_id}'
            response_body['results'] = None
            return response_body, 403
        follow = Followers()
        follow.follower_id = follower_id
        follow.following_id = following_id
        db.session.add(follow)
        db.session.commit()
        response_body['message'] = f'El usuario {follower_id} ahora segue al usuario {following_id}'
        response_body['results'] = follow.serialize()
        return response_body, 200
    

@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'El GET se ha ejecutado correctamente'
        rows = db.session.execute(db.select(Characters)).scalars()
        response_body['result'] = [row.serialize() for row in rows]
        return response_body, 200
    

@api.route('/people/<int:character_id>', methods=['GET'])
def show_current_character(character_id):
    character = db.session.execute(db.select(Characters).where(Characters.id == character_id)).scalar()
    if not character:
        return jsonify({"message": "Personaje no encontrado"}), 404
    return jsonify(character.serialize()), 200


@api.route('/characterfavorite', methods=['GET'])
def character_favorite():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'El GET se ha ejecutado correctamente'
        rows = db.session.execute(db.select(CharacterFavorites)).scalars()
        response_body['result'] = [row.serialize() for row in rows]
        return response_body, 200


@api.route('/planets', methods=['GET'])
def planets():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'El GET se ha ejecutado correctamente'
        rows = db.session.execute(db.select(Planets)).scalars()
        response_body['result'] = [row.serialize() for row in rows]
        return response_body, 200


@api.route('/planets/<int:planet_id>', methods=['GET'])
def show_current_planet(planet_id):
    planet = db.session.execute(db.select(Planets).where(Planets.id == planet_id)).scalar()
    if not planet:
        return jsonify({"message": "Planeta no encontrado"}), 404
    return jsonify(planet.serialize()), 200


@api.route('/planetsfavorite', methods=['GET'])
def planets_favorite():
    response_body = {}
    if request.method == 'GET':
        response_body['message'] = 'El GET se ha ejecutado correctamente'
        rows = db.session.execute(db.select(PlanetsFavorites)).scalars()
        response_body['result'] = [row.serialize() for row in rows]
        return response_body, 200
    
