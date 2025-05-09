from fastapi.testclient import TestClient
from datetime import datetime
from backend.main import app  # Asegúrate de que tu archivo principal se llame main.py o ajusta este import
from typing import Any
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

client = TestClient(app)

def test_get_coches_con_extras():
    payload : dict = {
        "marca": "MarcaSebas",
        "modelo": "ModeloSebas"
    }

    response = client.post("/getCochesConExtras", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert isinstance(data[0], dict)
    "matricula"         in data[0]
    "categoria"         in data[0]
    "marca"             in data[0]
    "modelo"            in data[0]
    "plazas"            in data[0]
    "techo"             in data[0]
    "marcha"            in data[0]   
    "puertas"           in data[0]
    "wifi"              in data[0]   
    "gps"               in data[0]   
    "silla_nino"        in data[0]   
    "cadenas"           in data[0]
    "id_oficina_actual" in data[0] 
