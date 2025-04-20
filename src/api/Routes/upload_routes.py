
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Productos, TigrisFiles
from flask import Blueprint, request, jsonify
from botocore.client import Config
from dotenv import load_dotenv
from flask import send_file
from flask_cors import CORS
from io import BytesIO
import pandas as pd
import boto3
import uuid
import os

# ... tus imports sin cambios ...
load_dotenv()
upload = Blueprint('upload', __name__)

# Configuración de AWS/Tigris (cliente S3 global)
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_ENDPOINT_URL_S3 = os.getenv("AWS_ENDPOINT_URL_S3")
AWS_REGION = os.getenv("AWS_REGION", "auto")
BUCKET_NAME = "inventary-user-2025"
config = Config(signature_version='s3v4')

s3 = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    endpoint_url=AWS_ENDPOINT_URL_S3,
    region_name=AWS_REGION,
    config=config
)

UPLOAD_FOLDER = "upload"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------ENDPOINT PARA SUBIR EL INVENTARIO A TIGRIS-----------------


@upload.route('/inventory', methods=['POST'])
@jwt_required()
def upload_inventory():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No se encontró archivo en la solicitud"}), 400

    file = request.files["file"]
    if not file.filename.endswith((".xls", ".xlsx")):
        return jsonify({"error": "Solo se permiten archivos Excel (.xls, .xlsx)"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        file_url = upload_to_tigris_s3(file_path, file.filename)
        df = pd.read_excel(file_path)

        expected_columns = ['nombre_del_producto',
                            'precio_por_unidad', 'descripción', 'unidades']
        if not all(col in df.columns for col in expected_columns):
            return jsonify({"error": "El archivo Excel no contiene las columnas esperadas"}), 400

        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        records = df.to_dict(orient="records")

        for record in records:
            producto = Productos(
                product_name=record['nombre_del_producto'],
                price_per_unit=record['precio_por_unidad'],
                description=record['descripción'],
                quantity=record['unidades'],
                user_id=user_id
            )
            db.session.add(producto)

        tigris_file = TigrisFiles(url=file_url, user_id=user_id)
        db.session.add(tigris_file)
        db.session.commit()
        os.remove(file_path)
        return jsonify({
            "message": f"{len(records)} productos cargados correctamente.",
            "file_url": file_url
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# -------------ENDPOINT PARA DESCARGAR EL INVENTARIO DEL USUARIO----------------------------


@upload.route("/download_inventory", methods=["GET"])
@jwt_required()
def download_user_inventory():
    """Endpoint para descargar el inventario específico del usuario autenticado"""
    try:
        # Obtener el ID del usuario desde el token JWT
        user_id = get_jwt_identity()

        # Verificar que el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Obtener todos los productos del usuario
        productos = Productos.query.filter_by(user_id=user_id).all()

        # Si no hay productos, devolver mensaje
        if not productos:
            return jsonify({"message": "No hay productos en tu inventario"}), 404

        # Crear DataFrame con los productos del usuario
        data = []
        for producto in productos:
            data.append({
                'nombre_del_producto': producto.product_name,
                'precio_por_unidad': producto.price_per_unit,
                'descripción': producto.description,
                'unidades': producto.quantity
            })

        df = pd.DataFrame(data)

        # Crear el Excel en memoria
        from io import BytesIO
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        # Preparar para enviar
        output.seek(0)

        # Devolver el archivo Excel con el inventario del usuario
        from flask import send_file
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f"inventario_usuario_{user_id}.xlsx"
        )

    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Error al generar el inventario: {str(e)}")
        print(f"Traceback completo: {error_traceback}")
        return jsonify({
            "error": f"Error al generar el inventario: {str(e)}",
            "traceback": error_traceback
        }), 500

# -------ENDPOINT PARA DESCARGAR LA PLANTILLA DEL INVENTARIO DE TIGRIS----------


@upload.route("/download_template", methods=["GET"])
@jwt_required()
def download_template():
    """Endpoint para descargar una plantilla Excel vacía con las columnas requeridas"""
    try:
        # Crear un DataFrame con las columnas requeridas pero sin datos
        df = pd.DataFrame(
            columns=['nombre_del_producto', 'precio_por_unidad', 'descripción', 'unidades'])

        # Crear el Excel en memoria
        from io import BytesIO
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)

        # Preparar para enviar
        output.seek(0)

        # Devolver directamente desde la memoria
        from flask import send_file
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name="plantilla_inventario.xlsx"
        )

    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        print(f"Error al generar la plantilla: {str(e)}")
        print(f"Traceback completo: {error_traceback}")
        return jsonify({
            "error": f"Error al generar la plantilla: {str(e)}",
            "traceback": error_traceback
        }), 500

# ----------------ENDPOINT PARA ACTUALIZAR EL INVENTARIO DE TIGRIS---------------------


@upload.route('/update_inventory', methods=['POST'])
@jwt_required()
def update_inventory():
    """
    Endpoint para actualizar el inventario existente desde un archivo Excel
    sin eliminar los datos originales durante el proceso
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No se encontró archivo en la solicitud"}), 400

    file = request.files["file"]
    if not file.filename.endswith((".xls", ".xlsx")):
        return jsonify({"error": "Solo se permiten archivos Excel (.xls, .xlsx)"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Subir archivo a Tigris como respaldo, pero sin eliminar el anterior
        file_url = upload_to_tigris_s3(file_path, f"update_{file.filename}")

        # Leer el archivo Excel
        df = pd.read_excel(file_path)

        expected_columns = ['nombre_del_producto',
                            'precio_por_unidad', 'descripción', 'unidades']
        if not all(col in df.columns for col in expected_columns):
            return jsonify({"error": "El archivo Excel no contiene las columnas esperadas"}), 400

        df.columns = [col.lower().replace(' ', '_') for col in df.columns]
        records = df.to_dict(orient="records")

        # Obtener todos los productos actuales del usuario para comparación
        existing_products = Productos.query.filter_by(user_id=user_id).all()
        existing_product_names = {p.product_name: p for p in existing_products}

        products_updated = 0
        products_added = 0

        # Procesar cada registro del Excel
        for record in records:
            product_name = record['nombre_del_producto']

            # Si el producto ya existe, actualizarlo
            if product_name in existing_product_names:
                product = existing_product_names[product_name]
                product.price_per_unit = record['precio_por_unidad']
                product.description = record['descripción']
                product.quantity = record['unidades']
                products_updated += 1
            # Si no existe, crear uno nuevo
            else:
                new_product = Productos(
                    product_name=product_name,
                    price_per_unit=record['precio_por_unidad'],
                    description=record['descripción'],
                    quantity=record['unidades'],
                    user_id=user_id
                )
                db.session.add(new_product)
                products_added += 1

        # Guardar el archivo en la tabla de TigrisFiles
        tigris_file = TigrisFiles(url=file_url, user_id=user_id)
        db.session.add(tigris_file)
        db.session.commit()

        # Limpiar archivo temporal
        os.remove(file_path)

        return jsonify({
            "message": f"Inventario actualizado: {products_updated} productos actualizados, {products_added} productos añadidos.",
            "file_url": file_url
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# -------ENDPOINT PARA ELIMINAR EL INVENTARIO DE TIGRIS-------------------------------


@upload.route("/delete-inventory/<int:inventory_id>", methods=['DELETE'])
def delete_inventory_from_tigris(inventory_id):
    """Elimina un archivo de Tigris por su ID en la base de datos"""
    try:
        tigris_file = TigrisFiles.query.get(inventory_id)

        if not tigris_file:
            return jsonify({"error": "Archivo no encontrado"}), 404

        db.session.delete(tigris_file)
        db.session.commit()

        return jsonify({
            "message": f"Archivo con ID {inventory_id} eliminado correctamente",
            "deleted_inventory_id": inventory_id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# -------ENDPOINT PARA ELIMINAR PRODUCTOS DEL INVENTARIO DE TIGRIS-----------------------


@upload.route("/delete-product/<int:product_id>", methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Elimina un producto específico por su ID"""
    try:
        # Verificar el usuario actual
        user_id = get_jwt_identity()

        # Si user_id es un string, convertirlo a int para comparar
        if isinstance(user_id, str) and user_id.isdigit():
            user_id = int(user_id)

        print(
            f"Intentando eliminar producto {product_id} para usuario {user_id}")

        # Encontrar el producto
        product = Productos.query.get(product_id)

        if not product:
            return jsonify({"error": "Producto no encontrado"}), 404

        print(f"Producto encontrado. Pertenece a usuario {product.user_id}")

        # Verificar que el producto pertenece al usuario actual
        if product.user_id != user_id:
            return jsonify({"error": "No tienes permiso para eliminar este producto"}), 403

        # Eliminar el producto
        db.session.delete(product)
        db.session.commit()

        return jsonify({
            "message": f"Producto {product_id} eliminado correctamente",
            "product_id": product_id
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar producto: {str(e)}")
        return jsonify({"error": str(e)}), 500

# -------------ACTUALIZA PRODUCTOS DE LA BASE DE DATOS DESDE EL PANEL-------------------------------

@upload.route("/update-product/<int:product_id>", methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        # Verificar el usuario actual (una sola vez)
        user_id = get_jwt_identity()
        user_id = int(user_id)  # Convertir a entero
        
        # Obtener datos de la solicitud
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se proporcionaron datos para actualizar"}), 400
            
        # Encontrar el producto
        product = Productos.query.get(product_id)
        
        if not product:
            return jsonify({"error": "Producto no encontrado"}), 404
            
        print(f"Usuario autenticado: {user_id}, tipo: {type(user_id)}")
        print(f"Usuario del producto: {product.user_id}, tipo: {type(product.user_id)}")
            
        # Verificar que el producto pertenece al usuario actual
        if product.user_id != user_id:
            return jsonify({"error": "No tienes permiso para modificar este producto"}), 403
            
        # Actualizar los campos del producto
        if 'product_name' in data:
            product.product_name = data['product_name']
            
        if 'price_per_unit' in data:
            product.price_per_unit = float(data['price_per_unit'])
            
        if 'description' in data:
            product.description = data['description']
            
        if 'quantity' in data:
            product.quantity = int(data['quantity'])
            
        if 'image_url' in data:
            product.image_url = data['image_url']
            
        # Guardar los cambios
        db.session.commit()
        
        return jsonify({
            "message": "Producto actualizado correctamente",
            "product": product.serialize()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# --------TRAE LA INFORMACION DEL INVENTARIO AL PANEL DEL INVENTARIO (PAGE)-------------------


@upload.route("/get-user-products", methods=['GET'])
@jwt_required()
def get_user_products():
    """Obtiene todos los productos del usuario autenticado"""
    try:
        user_id = get_jwt_identity()

        # Buscar productos del usuario actual
        products = Productos.query.filter_by(user_id=user_id).all()

        # Serializar los resultados
        products_serialized = [product.serialize() for product in products]

        return jsonify({"productos": products_serialized}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------ACTUALIZA LA IMAGEN DEL PRODUCTO DESDE EL PANEL--------------------------------


@upload.route("/upload-product-image", methods=['POST'])
@jwt_required()
def upload_product_image():
    """Sube una imagen para un producto y devuelve la URL"""
    user_id = get_jwt_identity()

    if "image" not in request.files:
        return jsonify({"error": "No se encontró imagen en la solicitud"}), 400

    file = request.files["image"]

    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400

    if file and allowed_file(file.filename):
        # Crear nombre único para el archivo
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"product_{user_id}_{uuid.uuid4().hex}.{ext}"

        # Subir a Tigris
        try:
            url = upload_to_tigris_s3(
                file.read(), unique_filename, 'product-images')

            return jsonify({"url": url}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Tipo de archivo no permitido"}), 400


def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# -------------ME TRAE LA INFORMACION DEL ARCHIVO (EXCEL) INVENTARIO PARA MOSTRARLA EN MI PANEL------------------

@upload.route("/current-inventory-info", methods=['GET'])
@jwt_required()
def get_current_inventory_info():
    """Obtiene información sobre el inventario actual del usuario"""
    try:
        user_id = get_jwt_identity()

        # Buscar el archivo de inventario más reciente del usuario
        latest_file = TigrisFiles.query.filter_by(
            user_id=user_id).order_by(TigrisFiles.id.desc()).first()

        if not latest_file:
            return jsonify({"message": "No se encontró ningún inventario"}), 404

        # Extraer el nombre del archivo de la URL
        import os
        from urllib.parse import urlparse, unquote

        url_path = urlparse(latest_file.url).path
        filename = os.path.basename(unquote(url_path))

        # Si el nombre tiene timestamp, intentar extraerlo
        import re
        timestamp_match = re.search(r'(\d{14})_', filename)
        last_updated = None

        if timestamp_match:
            timestamp_str = timestamp_match.group(1)
            from datetime import datetime
            try:
                last_updated = datetime.strptime(
                    timestamp_str, "%Y%m%d%H%M%S").isoformat()
            except ValueError:
                pass

        inventory_info = {
            "id": latest_file.id,
            "name": filename,
            "url": latest_file.url,
            "last_updated": last_updated
        }

        return jsonify({
            "inventory_info": inventory_info
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------CONFIGURACION DE TIGRIS DATA BASE--------------------------------


def upload_to_tigris_s3(file_path, file_name):
    try:
        try:
            s3.head_bucket(Bucket=BUCKET_NAME)
        except:
            s3.create_bucket(Bucket=BUCKET_NAME)

        import datetime
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        unique_filename = f"{timestamp}_{file_name}"

        s3.upload_file(
            file_path,
            BUCKET_NAME,
            unique_filename,
            ExtraArgs={
                'ContentType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        )

        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': unique_filename},
            ExpiresIn=3600 * 24 * 7
        )

        return url

    except Exception as e:
        raise Exception(f"Error al subir a Tigris S3: {str(e)}")
