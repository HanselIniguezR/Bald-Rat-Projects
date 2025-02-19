from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user
from database.database import engine, get_db
from models.models import Base, User
from fastapi.middleware.cors import CORSMiddleware
from utils.email_utils import send_welcome_email  # Importar la utilidad para enviar correos

# Crear la base de datos auth_db si no existe
Base.metadata.create_all(bind=engine)

# Instancia de la aplicación FastAPI
app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Cambiar "*" por dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 **Esquemas de datos**
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str
    role: str  # ⚠️ Ahora es un string

    @classmethod
    def from_orm(cls, user: User):
        return cls(
            username=user.username,
            email=user.email,
            role=user.role.value  # ⚠️ Convierte Enum a string
        )

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# 📌 **Rutas del Auth API**

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Registra un nuevo usuario en la base de datos y envía un correo de bienvenida."""

    # Verificar si el usuario o correo ya existen en auth_db
    existing_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario o correo ya registrados")

    # Crear nuevo usuario en auth_db
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        role="student"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Enviar correo de bienvenida en segundo plano
    background_tasks.add_task(
        send_welcome_email,
        email_to=user.email,
        username=user.username
    )

    return UserResponse(
        username=new_user.username,
        email=new_user.email,
        role=new_user.role.value  # ⚠️ Convertir el enum a string
    )

@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Inicia sesión y devuelve un token de acceso con el rol y el username del usuario."""

    print(f"Intentando autenticar: {user.email}")  # 🔍 Mensaje de depuración

    # Verificar si el usuario existe en auth_db
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user:
        print("Usuario no encontrado en la base de datos")  # 🔍 Mensaje de depuración
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    print(f"Usuario encontrado: {db_user.email}")  # 🔍 Mensaje de depuración

    # Verificar si la contraseña coincide
    if not verify_password(user.password, db_user.password_hash):
        print("Contraseña incorrecta")  # 🔍 Mensaje de depuración
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    print("Contraseña correcta, generando token...")  # 🔍 Mensaje de depuración

    # ✅ Generar un token de acceso con el username y el rol
    token = create_access_token({
        "sub": db_user.username,  # 🔹 Ahora el username está en "sub"
        "role": db_user.role.value
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role.value,  # 🔹 Ahora enviamos también el rol
        "username": db_user.username  # 🔹 Se incluye el username en la respuesta
    }


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Devuelve los datos del usuario autenticado."""
    return UserResponse(username=current_user.username, email=current_user.email, role=current_user.role.value)

@app.get("/auth/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Devuelve la lista de usuarios registrados."""
    
    users = db.query(User).all()
    return [
        UserResponse(
            username=user.username,
            email=user.email,
            role=user.role.value  # ⚠️ Convertimos el Enum a string
        )
        for user in users
    ]


