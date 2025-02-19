from sqlalchemy import create_engine

# Configuración de la base de datos (usando tus credenciales)
DATABASE_URL = "mysql+pymysql://root:baldrat@localhost/auth_db"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos auth_db")
except Exception as e:
    print("❌ Error al conectar a la base de datos:", e)
