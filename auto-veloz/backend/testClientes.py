from cliente import obtener_cliente, Cliente, TipoCliente
from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_obtener_cliente_correcto():
    correo = "antonio@gmail.com"
    contrasena = "antonio"
    cliente = obtener_cliente(correo, contrasena)
    assert cliente is not None
    assert cliente.correo == correo
    assert cliente.nombre == "antonio"

def test_registro_con_correo_invalido():
    payload = {
        "nombre": "Usuario Prueba",
        "dni": "12345678Z",
        "fecha_nacimiento": "1995-05-10",
        "correo": "correo-no-valido",  # Esto está mal formateado
        "tipo_usuario": "cliente",
        "contrasena": "contrasena123"
    }

    response = client.post("/register", json=payload)
    assert response.status_code == 400 or response.status_code == 422
    assert response.json() == {"detail": "Correo electrónico inválido."}


