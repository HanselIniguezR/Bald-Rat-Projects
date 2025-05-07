from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

# Clave secreta para firmar los tokens JWT
SECRET_KEY = "your_secret_key"  # Cambia esto por una clave segura en producción

def hash_password(password):
    """Genera un hash seguro para una contraseña."""
    return generate_password_hash(password)

def verify_password(password, password_hash):
    """Verifica si una contraseña coincide con su hash."""
    return check_password_hash(password_hash, password)

def create_access_token(data, expires_delta=timedelta(hours=1)):
    """Crea un token de acceso JWT con datos y una fecha de expiración."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

def get_current_user(token):
    """Decodifica un token JWT y devuelve los datos del usuario."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token expirado")
    except jwt.InvalidTokenError:
        raise Exception("Token inválido")