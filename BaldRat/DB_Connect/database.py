from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

# Obtener la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Validar que DATABASE_URL no esté vacía
if not DATABASE_URL:
    raise ValueError("❌ ERROR: La variable de entorno 'DATABASE_URL' no está definida. Verifica tu configuración.")

try:
    # Crear el motor de conexión a la base de datos
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    
    # Intentar conectar para validar que la base de datos está accesible
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos en Railway 🚀")

    # Crear la sesión de la base de datos
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Crear la base para los modelos
    Base = declarative_base()

except Exception as e:
    print(f"❌ ERROR: No se pudo conectar a la base de datos: {e}")
    raise  # Detiene la ejecución si no se puede conectar a la base de datos

# Dependencia para obtener la sesión de la base de datos en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
