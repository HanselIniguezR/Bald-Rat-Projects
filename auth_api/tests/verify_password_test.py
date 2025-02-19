from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generar hash para verificar
plain_password = "123"
hashed_password = pwd_context.hash(plain_password)
print("Nuevo hash:", hashed_password)

# Verificar si coinciden
is_valid = pwd_context.verify(plain_password, hashed_password)
print("¿Es válida la contraseña?", is_valid)
