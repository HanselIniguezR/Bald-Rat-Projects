# Usa Python 3.12 como imagen base
FROM python:3.12

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos los archivos del proyecto dentro del contenedor
COPY . .

# Instala las dependencias desde requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto 8000 para FastAPI
EXPOSE 8000

# Ejecutar la aplicación desde la carpeta src
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
