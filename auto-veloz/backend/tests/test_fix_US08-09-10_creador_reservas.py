from fastapi.testclient import TestClient
from datetime import datetime
from main import app  # Asegúrate de que tu archivo principal se llame main.py o ajusta este import

#correrlos desde donde esté el main

client = TestClient(app)

def test_crear_reserva():
    payload = {
        
    "marca": "SUV",
  "modelo": "Toyota",
  "wifi": True,
  "gps": True,
  "silla_nino": False,
  "cadenas": True,
  "correo": "manolocasas@mail.com",
  "id_oficina_origen": 1,
  "id_oficina_destino": 2,
   "fecha_inicio": "2025-05-05T13:59:49.603Z",
  "fecha_fin": "2025-05-06T13:59:49.603Z",
  "tarjeta_credito": "aaa",
  "precio_total": 10



}

    response = client.post("/crearReserva", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "id_cliente" in data
    assert isinstance(data["id_cliente"], float)

