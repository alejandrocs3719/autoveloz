from fastapi import FastAPI
from pydantic import BaseModel
from insertarOficinas import Oficina, obtener_oficinas

app = FastAPI()

# Modelo para validar los datos de entrada
class OficinaRequest(BaseModel):
    nombre: str
    direccion: str

@app.post("/putOficina/")
def crear_oficina(oficina: OficinaRequest):
    nueva_oficina = Oficina(oficina.nombre, oficina.direccion)
    nueva_oficina.guardar_oficina()  # Llamamos a la función para guardar en la BD
    return {"mensaje": "Oficina añadida correctamente", "nombre": oficina.nombre, "direccion": oficina.direccion}


@app.get("/getOficinas/")
def mostrar_oficinas():
    lista_oficinas = obtener_oficinas()
    for oficina in lista_oficinas:
        print(oficina.mostrar_info())
    return lista_oficinas