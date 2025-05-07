from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import pymysql
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mysql.connector
from flask import make_response
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from datetime import datetime
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# 🔗 Configuración de la base de datos en Railway
DB_URL = "mysql://root:zNwiULycWwHXbuWlbvYzYrCAvzDCuCql@switchyard.proxy.rlwy.net:56241/railway"

# 🔗 Extraer los datos de la URL
db_config = DB_URL.replace("mysql://", "").split("@")
user_pass, host_port_db = db_config
user, password = user_pass.split(":")
host_port, database = host_port_db.split("/")
host, port = host_port.split(":")

db_config = {
    "host": "switchyard.proxy.rlwy.net",
    "user": "root",
    "password": "zNwiULycWwHXbuWlbvYzYrCAvzDCuCql",
    "database": "railway",
    "port": 56241,
}

# 📌 Conectar a MySQL en Railway
def connect_db():
    return pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        port=int(port),
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route("/notifications", methods=["GET"])
def get_notifications():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Falta user_id"}), 400

    connection = connect_db()
    cursor = connection.cursor() 
    cursor.execute("SELECT title, message FROM notifications WHERE user_id = %s AND status = 'sent'", (user_id,))
    notifications = cursor.fetchall()
    cursor.close()
    connection.close()

    response = jsonify(notifications)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Asegura CORS en la respuesta
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    return jsonify(notifications), 200


# 📌 Endpoint para recibir visitas y enviar notificación de bienvenida
@app.route("/welcome", methods=["POST"])
def welcome_notification():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id es requerido"}), 400

    try:
        conn = connect_db()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO notifications (user_id, type, title, message, status)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, "system", "Bienvenido", "¡Bienvenido a la plataforma!", "sent"))
            conn.commit()
        
        # 🔔 Emitir evento en tiempo real con Socket.IO
        socketio.emit("new_notification", {"user_id": user_id, "message": "¡Bienvenido a la plataforma!"})

        return jsonify({"status": "success", "message": "Notificación enviada"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Servicio de Notificaciones Activo"}), 200

@app.route('/favicon.ico')
def favicon():
    return "", 204  # Responde con "No Content"


EMAIL_ADDRESS = "baldrat20@gmail.com"
EMAIL_PASSWORD = "baldrat0192"

# Función para enviar correos electrónicos
def send_email(to_email, subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False

EMAIL_SENDER = "baldrat20@gmail.com"
EMAIL_PASSWORD = "baldrat0192"

try:
    conn = pymysql.connect(
        host="switchyard.proxy.rlwy.net",
        port=56241,
        user="root",
        password="zNwiULycWwHXbuWlbvYzYrCAvzDCuCql",
        database="railway"
    )
    print("✅ Conexión exitosa a la base de datos")
except Exception as e:
    print(f"❌ Error conectando a la base de datos: {e}")
    conn = None  # Evita que el programa intente usar una conexión fallida

def get_email_from_db():
    """Busca el email en la tabla email_notifications con email_id = 2"""
    if conn is None:
        print("❌ No hay conexión a la base de datos.")
        return None

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT email FROM email_notifications WHERE email_id = %s", (2,))
            resultado = cursor.fetchone()
            return resultado[0] if resultado else None
    except Exception as e:
        print(f"❌ Error al consultar la base de datos: {e}")
        return None

def send_email(to_email):
    """Envía un correo de bienvenida"""
    try:
        subject = "Bienvenido a nuestra plataforma"
        body = "Gracias por registrarte en nuestra plataforma. ¡Esperamos que disfrutes la experiencia!"

        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, to_email, msg.as_string())
        server.quit()

        return True
    except Exception as e:
        print("❌ Error al enviar el correo:", e)
        return False

@app.route("/send_welcome_email", methods=["POST"])
def send_welcome_email():
    """Endpoint para enviar el email de bienvenida"""
    to_email = get_email_from_db()

    if not to_email:
        return jsonify({"error": "No se encontró el email en la base de datos"}), 400

    if send_email(to_email):
        return jsonify({"message": "Correo enviado correctamente"}), 200
    else:
        return jsonify({"error": "Error al enviar el correo"}), 500

def get_db_connection():
    conn = sqlite3.connect("notifications.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/notification", methods=["POST"])
def handle_notification():
    data = request.json
    notification_type = data.get("type")
    notification_id = data.get("notification_id")

    if notification_type == "live":
        return send_live_notification()
    elif notification_type == "save":
        return save_notification()
    elif notification_type == "specific" and notification_id:
        return send_specific_notification(notification_id)
    else:
        return jsonify({"success": False, "error": "Tipo de notificación no válido"}), 400

# Enviar notificación en directo
def send_live_notification():
    # Aquí puedes agregar la lógica para enviar la notificación en directo a notiAdm.html
    return jsonify({"success": True, "message": "Notificación en directo enviada"})

# Guardar notificación en la BD sin enviarla
db_config = {
    'user': 'root',
    'password': 'zNwiULycWwHXbuWlbvYzYrCAvzDCuCql',
    'host': 'switchyard.proxy.rlwy.net',
    'port': '56241',
    'database': 'railway'
}

# Función para obtener la conexión de la base de datos
def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/save_notification', methods=['POST'])
def save_notification():
    data = request.json
    try:
        print("Recibiendo datos para guardar:", data)

        # Validar y ajustar datos (agregar valores por defecto si faltan)
        if not data.get('type'):
            data['type'] = 'system'  # Tipo por defecto
        if not data.get('status'):
            data['status'] = 'sent'  # Estado por defecto
        if not data.get('created_at'):
            data['created_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Fecha por defecto
        else:
            # Asegurarse de que created_at esté en formato correcto
            try:
                created_at = datetime.strptime(data['created_at'], '%Y-%m-%dT%H:%M')
                data['created_at'] = created_at.strftime('%Y-%m-%d %H:%M:%S')
            except ValueError:
                print("Error al formatear la fecha de created_at.")
                return jsonify({"success": False, "error": "Fecha de created_at inválida."}), 400

        # Si read_at está vacío, se debe manejar como NULL
        if not data.get('read_at'):
            data['read_at'] = None

        print("Datos procesados antes de la inserción:", data)

        # Conectar a la base de datos
        conn = connect_db()
        try:
            with conn.cursor() as cursor:
                # Consulta SQL para insertar datos (sin 'notification_id' ya que es auto_increment)
                sql = """
                INSERT INTO notifications (user_id, type, title, message, status, created_at, read_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                print("Ejecutando consulta SQL:", sql)

                # Ejecutar la consulta con los datos
                cursor.execute(sql, (
                    data['user_id'],
                    data['type'],
                    data['title'],
                    data['message'],
                    data['status'],
                    data['created_at'],
                    data['read_at']
                ))

                # Confirmar la transacción
                conn.commit()
                print("Transacción confirmada.")

            return jsonify({"success": True})

        except Exception as e:
            print("Error en la transacción:", str(e))

        finally:
            try:
                conn.close()  # Aseguramos que la conexión se cierra
            except Exception as e:
                print(f"Error al cerrar la conexión: {str(e)}")

        return jsonify({"success": True})

    except Exception as e:
        print("Error en la transacción:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500

# Enviar una notificación específica por ID
def send_specific_notification(notification_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM notifications WHERE notification_id = ?", (notification_id,))
    notification = cursor.fetchone()

    if not notification:
        return jsonify({"success": False, "error": "Notificación no encontrada"}), 404

    # Aquí podrías agregar la lógica para enviar la notificación específica
    return jsonify({"success": True, "message": f"Notificación {notification_id} enviada"})


# 🔥 Iniciar el servidor
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)




@app.post("/send_message_notification")
def send_message_notification(user_id: int, sender_name: str):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO notifications (user_id, type, title, message, status, created_at, read_at)
                VALUES (%s, 'system', '📩 Nuevo Mensaje Recibido', %s, 'pending', NOW(), NULL)
            """
            message = f"Tienes un nuevo mensaje de {sender_name}. Revisa tu bandeja de entrada para responder cuanto antes."
            cursor.execute(sql, (user_id, message))
            conn.commit()
        return {"success": True, "message": "Notificación enviada"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


@app.post("/update_tramite_status")
def update_tramite_status(tramite_id: int, user_id: int, new_status: str, tramite_name: str):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Actualizar el estado del trámite
            sql_update = "UPDATE tramites SET estado = %s WHERE id = %s"
            cursor.execute(sql_update, (new_status, tramite_id))

            # Insertar notificación
            sql_notify = """
                INSERT INTO notifications (user_id, type, title, message, status, created_at, read_at)
                VALUES (%s, 'system', '🔄 Actualización en tu Trámite', %s, 'pending', NOW(), NULL)
            """
            message = f"El estado de tu trámite **{tramite_name}** ha cambiado a **{new_status}**. Consulta los detalles en tu perfil."
            cursor.execute(sql_notify, (user_id, message))

            conn.commit()
        return {"success": True, "message": "Trámite actualizado y notificación enviada"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


@app.post("/send_welcome_notification")
def send_welcome_notification(user_id: int):
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Verificar si el usuario ya recibió la notificación de bienvenida
            sql_check = """
                SELECT COUNT(*) as count FROM notifications 
                WHERE user_id = %s AND title = '🎉 ¡Bienvenido a la Plataforma!'
            """
            cursor.execute(sql_check, (user_id,))
            result = cursor.fetchone()
            if result["count"] > 0:
                return {"message": "El usuario ya recibió la notificación de bienvenida"}

            # Insertar notificación de bienvenida
            sql_insert = """
                INSERT INTO notifications (user_id, type, title, message, status, created_at, read_at)
                VALUES (%s, 'system', '🎉 ¡Bienvenido a la Plataforma!', 
                'Hola, estamos felices de tenerte aquí. Explora las opciones disponibles y empieza a compartir conocimientos.', 
                'pending', NOW(), NULL)
            """
            cursor.execute(sql_insert, (user_id,))
            conn.commit()

        return {"success": True, "message": "Notificación de bienvenida enviada"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Notification(db.Model):
    __tablename__ = 'notifications'
    notification_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)

@app.route("/notifications")
def get_notifications():
    user_id = request.args.get("user_id")

    if user_id:
        notis = Notification.query.filter_by(user_id=user_id).all()
    else:
        notis = Notification.query.all()  # Muestra todas si no hay user_id

    return jsonify([
        {
            "notification_id": n.notification_id,
            "user_id": n.user_id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "status": n.status,
            "created_at": n.created_at.isoformat()
        } for n in notis
    ])


