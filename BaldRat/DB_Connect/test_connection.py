from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    # Crear la conexión con SQLAlchemy
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos en Railway 🚀")
except Exception as e:
    print("❌ Error al conectar a la base de datos:", e)
