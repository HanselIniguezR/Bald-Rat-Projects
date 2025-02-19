import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()  # Cargar variables de entorno

# 📌 Verificar si las variables de entorno se están cargando correctamente
print("🔍 Verificando configuración del correo...")
print("EMAIL_SENDER:", os.getenv("EMAIL_SENDER"))
print("EMAIL_PASSWORD:", "********")  # No imprimir la contraseña en producción
print("SMTP_SERVER:", os.getenv("SMTP_SERVER"))
print("SMTP_PORT:", os.getenv("SMTP_PORT"))

# 📌 Configuración para FastAPI-Mail
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_SENDER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_SENDER"),
    MAIL_PORT=int(os.getenv("SMTP_PORT")),
    MAIL_SERVER=os.getenv("SMTP_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_welcome_email(email_to: EmailStr, username: str):
    """📩 Verificar antes de enviar el correo de bienvenida."""
    
    print(f"✅ Preparando correo para: {email_to}")
    
    subject = "🚀 ¡Bienvenido a Bald Rat Cut Projects!"

    body = f"""
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #f39c12; text-align: center;">¡Hola, {username}! 🎉</h1>
        <p style="font-size: 16px;">Te damos la bienvenida a <strong>Bald Rat Cut Projects</strong>, el espacio donde las ideas innovadoras cobran vida.</p>
        
        <div style="text-align: center;">
            <img src="cid:logo_image" width="200px" alt="Bald Rat Cut Projects">
        </div>
        
        <p style="font-size: 16px;">
            🎯 Aquí podrás colaborar, aprender y desarrollar proyectos tecnológicos junto a una comunidad apasionada.
        </p>
        <p style="font-size: 16px;">
            🚀 ¡Nos emociona tenerte con nosotros! Si tienes dudas, contáctanos en cualquier momento.
        </p>
        
        <p style="font-size: 16px; text-align: center; color: #555;">
            <strong>Equipo Bald Rat Cut Projects</strong> <br>
            <a href="https://baldratcutprojects.com" style="color: #f39c12;">Visita nuestra página</a>
        </p>
    </div>
    """

    # 📌 Construir la ruta absoluta de la imagen
    current_dir = os.path.dirname(os.path.abspath(__file__))  # Directorio actual (utils/)
    image_path = os.path.join(current_dir, "../static/logo.png")  # Ruta relativa a static/logo.png

    if not os.path.exists(image_path):
        print(f"❌ ERROR: La imagen '{image_path}' no existe. Verifica la ruta.")
    else:
        print(f"✅ Imagen encontrada: {image_path}")

    # 📌 Crear el mensaje
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype="html",
        attachments=[{
            "file": image_path,
            "headers": {"Content-ID": "<logo_image>"}
        }]
    )

    # 📌 Intentar enviar el correo
    fm = FastMail(conf)
    try:
        print("📨 Enviando correo...")
        await fm.send_message(message)
        print(f"✅ Correo enviado con éxito a {email_to}")
    except Exception as e:
        print(f"❌ Error al enviar el correo: {e}")

