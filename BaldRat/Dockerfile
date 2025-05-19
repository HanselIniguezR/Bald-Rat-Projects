# Imagen base oficial de Python
FROM python:3.12-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de requerimientos
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos de la aplicación
COPY . .

# Establece la variable de entorno PYTHONPATH
ENV PYTHONPATH=/app

# Expone el puerto por donde se ejecutará el microservicio
EXPOSE 8004

# Comando para iniciar el servidor
CMD ["python", "app.py"]