import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from DB_Connect.database import Base
from sqlalchemy import Column, Integer, String, Text, Enum, Date, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    professor_id = Column(Integer, nullable=False)
    status = Column(Enum("open", "closed", "completed"), default="open", nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)  # Llamar a func.now()
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)  # Llamar a func.now()

    collaborators = relationship("ProjectCollaborator", back_populates="project")


class ProjectCollaborator(Base):
    __tablename__ = "project_collaborators"

    collaborator_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, nullable=False)
    role = Column(Enum("assistant", "researcher", "intern"), nullable=False, default="intern")
    joined_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)  # Llamar a func.now()
    status = Column(Enum("active", "completed", "left"), nullable=False, default="active")

    project = relationship("Project", back_populates="collaborators")

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("admin", "student", "teacher"), default="student", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)  # Llamar a func.now()
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    token = Column(String(255), nullable=False, unique=True)
    expires_at = Column(TIMESTAMP, nullable=False)