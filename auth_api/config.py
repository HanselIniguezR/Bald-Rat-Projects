from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración del JWT
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")  # Clave secreta
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # Algoritmo de firma
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))  # Expiración de tokens en minutos
