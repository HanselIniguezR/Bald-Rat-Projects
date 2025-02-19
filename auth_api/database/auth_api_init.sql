-- Crear tabla 'users'
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del usuario
    username VARCHAR(50) UNIQUE NOT NULL, -- Nombre de usuario único
    email VARCHAR(100) UNIQUE NOT NULL, -- Correo electrónico único
    password_hash TEXT NOT NULL, -- Contraseña almacenada en formato hash
    role ENUM('student', 'professor', 'admin') DEFAULT 'student' NOT NULL, -- Rol del usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- Crear tabla 'password_reset_tokens'
CREATE TABLE password_reset_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del token
    user_id INT NOT NULL, -- ID del usuario asociado
    token VARCHAR(255) UNIQUE NOT NULL, -- Token único de recuperación
    expires_at TIMESTAMP NOT NULL, -- Fecha de expiración del token
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Relación con 'users'
);

-- Crear tabla 'sessions'
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY, -- Identificador único de la sesión
    user_id INT NOT NULL, -- Usuario autenticado
    ip_address VARCHAR(45) NOT NULL, -- Dirección IP desde donde inició sesión
    user_agent TEXT NOT NULL, -- Información del navegador/dispositivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de inicio de sesión
    expires_at TIMESTAMP NOT NULL, -- Fecha de expiración de la sesión
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Relación con 'users'
);
