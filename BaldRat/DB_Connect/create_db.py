from BaldRat.DB_Connect.database import Base, engine
from BaldRat.DB_Connect.models import Project, ProjectCollaborator

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas exitosamente.")