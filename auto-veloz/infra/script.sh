#!/bin/bash

# Variables
APP_DIR="$HOME/autoveloz/auto-veloz/backend"
VENV_DIR="$HOME/env"
PYTHON_VERSION="python3"

echo "🚀 Iniciando configuración de FastAPI en Ubuntu..."

# Actualizar paquetes
echo "🔄 Actualizando paquetes del sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Python y pip si no están instalados
echo "🐍 Instalando Python y pip..."
sudo apt install -y $PYTHON_VERSION python3-pip

# Crear entorno virtual si no existe
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creando entorno virtual..."
    $PYTHON_VERSION -m venv $VENV_DIR
fi

# Activar entorno virtual
source $VENV_DIR/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias de FastAPI..."
pip install -r $APP_DIR/requirements.txt

# Crear servicio systemd para ejecutar FastAPI como proceso en segundo plano
SERVICE_FILE="/etc/systemd/system/fastapi.service"

echo "⚙️ Configurando servicio systemd para FastAPI..."
sudo bash -c "cat > $SERVICE_FILE" <<EOL
[Unit]
Description=FastAPI Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=$APP_DIR
ExecStart=$VENV_DIR/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# Recargar systemd y habilitar el servicio
echo "🔄 Recargando systemd y habilitando el servicio..."
sudo systemctl daemon-reload
sudo systemctl enable fastapi
sudo systemctl restart fastapi

echo "✅ FastAPI configurado y corriendo en http://127.0.0.1:8000/"
