from fastapi.testclient import TestClient
from datetime import datetime
from main import app  # Asegúrate de que tu archivo principal se llame main.py o ajusta este import

client = TestClient(app)

def test_get_precio():
    payload = {
        "marca": "SUV",
        "modelo": "Toyota",
        "wifi": True,
        "gps": True,
        "silla_nino": False,
        "cadenas": True,
        "fecha_inicio": "2025-05-05T13:59:49.603Z",
        "fecha_fin": "2025-05-04T13:59:49.603Z",
        "id_oficina_actual": 1
}

    response = client.post("/getPrecio", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "precio" in data
    assert isinstance(data["precio"], float)


def test_get_oficina_coche_valido():
    response = client.post("/getOficinaCoche", json={
        "marca": "SUV",
        "modelo": "Toyota",
        "wifi": True,
        "gps": True,
        "silla_nino": False,
        "cadenas": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data is not None
    assert "oficina" in data
    assert isinstance(data["oficina"], list)