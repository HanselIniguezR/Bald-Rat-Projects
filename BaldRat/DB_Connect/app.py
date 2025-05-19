from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from BaldRat.utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user
from BaldRat.DB_Connect.database import engine, get_db
from BaldRat.DB_Connect.models import Base, User, PasswordResetToken
from fastapi.middleware.cors import CORSMiddleware
from BaldRat.utils.email_utils import send_welcome_email, send_password_reset_email
from uuid import uuid4
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template, redirect, url_for

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
    user_id: int
    username: str
    email: str
    role: str  # ⚠️ Ahora es un string

    @classmethod
    def from_orm(cls, user: User):
        return cls(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            role=user.role.value  # ⚠️ Convierte Enum a string
        )

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


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
        user_id=new_user.user_id,
        username=new_user.username,
        email=new_user.email,
        role=new_user.role.value  # ⚠️ Convertir el enum a string
    )

@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Inicia sesión y devuelve un token de acceso con el rol y el username del usuario."""

    # Verificar si el usuario existe en auth_db
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Verificar si la contraseña coincide
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # ✅ Generar un token de acceso con el username y el rol
    token = create_access_token({
        "sub": db_user.username,
        "role": db_user.role.value
    })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=db_user.role.value,
        username=db_user.username
    )

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Devuelve los datos del usuario autenticado."""
    return UserResponse(user_id=current_user.user_id, username=current_user.username, email=current_user.email, role=current_user.role.value)

@app.get("/auth/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Devuelve la lista de usuarios registrados."""
    
    users = db.query(User).all()
    return [
        UserResponse(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            role=user.role.value
        )
        for user in users
    ]

@app.delete("/auth/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Elimina un usuario por su ID."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}

@app.put("/auth/users/{user_id}")
def update_user(user_id: int, user_data: UserCreate, db: Session = Depends(get_db)):
    """Actualiza los datos de un usuario."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.username = user_data.username
    user.email = user_data.email
    user.password_hash = hash_password(user_data.password)
    db.commit()
    db.refresh(user)
    return {"message": "Usuario actualizado correctamente"}

@app.post("/auth/forgot-password")
def forgot_password(data: PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Solicitar un correo de recuperación de contraseña"""
    
    # Verificar si el correo está registrado
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Respuesta genérica por razones de seguridad
        return {"message": "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."}

    # Generar token de recuperación
    token = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=30)

    # Crear un nuevo token de recuperación en la base de datos
    reset_token = PasswordResetToken(user_id=user.user_id, token=token, expires_at=expires_at)
    db.add(reset_token)
    db.commit()

    # Enviar el correo de recuperación en segundo plano
    background_tasks.add_task(
        send_password_reset_email,
        email_to=user.email,
        username=user.username,
        token=token
    )

    return {"message": "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."}


@app.post("/auth/reset-password")
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Restablecer la contraseña con un token válido"""
    
    # Verificar si el token de recuperación es válido y no ha expirado
    token_entry = db.query(PasswordResetToken).filter(PasswordResetToken.token == data.token).first()

    if not token_entry:
        raise HTTPException(status_code=400, detail="Token inválido")

    if token_entry.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expirado")

    # Verificar si el usuario asociado al token existe
    user = db.query(User).filter(User.user_id == token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Validar la nueva contraseña
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres.")

    # Actualizar la contraseña del usuario
    user.password_hash = hash_password(data.new_password)

    # Eliminar el token de restablecimiento después de usarlo
    db.delete(token_entry)
    db.commit()

    return {"message": "Contraseña actualizada exitosamente."}



