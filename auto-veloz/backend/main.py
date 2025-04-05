from fastapi import FastAPI
from pydantic import BaseModel
from insertarOficinas import Oficina, obtener_oficinas

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    root_path="/api",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o una lista específica
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Modelo para validar los datos de entrada
class OficinaRequest(BaseModel):
    nombre: str
    direccion: str

@app.post("/putOficina")
def crear_oficina(oficina: OficinaRequest):
    nueva_oficina = Oficina(0, oficina.nombre, oficina.direccion)
    nueva_oficina.guardar_oficina()  # Llamamos a la función para guardar en la BD
    return {"mensaje": "Oficina añadida correctamente", "id":oficina.id, "nombre": oficina.nombre, "direccion": oficina.direccion}


@app.get("/getOficinas")
def mostrar_oficinas():
    lista_oficinas = obtener_oficinas()
    # for oficina in lista_oficinas:
    #     print(oficina.mostrar_info())
    return lista_oficinas

from fastapi import Request

@app.get("/debug")
async def debug_info(request: Request):
    return {
        "root_path": request.scope.get("root_path"),
        "path": request.scope.get("path"),
        "headers": dict(request.headers),
    }

