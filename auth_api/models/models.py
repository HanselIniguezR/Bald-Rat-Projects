from sqlalchemy import Column, Integer, String, Enum, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

# Base declarativa para SQLAlchemy
Base = declarative_base()

# Enum para los roles de usuario
class UserRole(enum.Enum):
    student = "student"
    professor = "professor"
    admin = "admin"

# Modelo para la tabla 'users'
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    
    # 🚀 Corrección en la fecha de creación y actualización
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relación con la tabla 'password_reset_tokens'
    reset_tokens = relationship("PasswordResetToken", back_populates="user", cascade="all, delete-orphan")

    # Relación con la tabla 'sessions'
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")

# Modelo para la tabla 'password_reset_tokens'
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)

    # Relación con la tabla 'users'
    user = relationship("User", back_populates="reset_tokens")

# Modelo para la tabla 'sessions'
class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String(255), primary_key=True, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    ip_address = Column(String(45), nullable=False)
    user_agent = Column(Text, nullable=False)

    # 🚀 Corrección en la fecha de creación
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)

    # Relación con la tabla 'users'
    user = relationship("User", back_populates="sessions")
