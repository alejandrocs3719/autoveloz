from fastapi import FastAPI
from pydantic import BaseModel
from insertarOficinas import Oficina

app = FastAPI()

# Modelo para validar los datos de entrada
class OficinaRequest(BaseModel):
    nombre: str
    direccion: str

@app.post("/oficina/")
def crear_oficina(oficina: OficinaRequest):
    nueva_oficina = Oficina(oficina.nombre, oficina.direccion)
    nueva_oficina.guardar_en_db()  # Llamamos a la función para guardar en la BD
    return {"mensaje": "Oficina añadida correctamente", "nombre": oficina.nombre, "direccion": oficina.direccion}

