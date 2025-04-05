from fastapi import FastAPI
from pydantic import BaseModel
from oficina import Oficina, obtener_oficinas
from coche import Coche

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
# Modelos para validar los datos de entrada
class OficinaRequest(BaseModel):
    nombre: str
    direccion: str

class CocheRequest(BaseModel):
    matricula         : str
    categoria         : str
    marca             : str
    modelo            : str
    plazas            : int
    techo             : bool
    marcha            : str   
    puertas           : int
    wifi              : bool   
    gps               : bool   
    silla_nino        : bool   
    cadenas           : bool
    id_oficina_actual : int 

class ExtraCocheRequest(BaseModel):
    marca  : str
    modelo : str

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

@app.post("/putCoches")
def crear_coche(coche : CocheRequest):
    nuevo_coche = Coche(coche.matricula, 
                        coche.categoria, 
                        coche.marca, 
                        coche.modelo, 
                        coche.plazas, 
                        coche.techo, 
                        coche.marcha, 
                        coche.puertas, 
                        coche.wifi, 
                        coche.gps, 
                        coche.silla_nino, 
                        coche.cadenas, 
                        coche.id_oficina_actual)
    nuevo_coche.guardar_en_db()
    return {"mensaje": "Coche añadido correctamente", "matricula": coche.matricula}

@app.get("/getCoches")
def get_coches():
    coches : list[Coche] | None = Coche.obtener_desde_db(None)

    resp : dict[str, list[list[str]]] = {"coches" : []}

    for coche in coches:
        resp["coches"].append([coche.marca, coche.modelo])
    
    return resp

@app.post("/getExtrasCoche")
def get_extras_coche(req : ExtraCocheRequest):
    coches : list[Coche] | None = Coche.obtener_desde_db(None)

    resp : dict[str, list[list[str]]] = {"marca" : req.marca, "modelo" : req.modelo}

    # Inicializamos con una set vacio (para evitar duplicidad) todos los key-value pairs del json de respuesta
    for attr in CocheRequest.model_fields.keys():
        if attr != "marca" and attr != "modelo":
            resp[attr] = set()
            
    for coche in coches:
        if coche.marca == req.marca and coche.modelo == req.modelo:
            for attr in CocheRequest.model_fields.keys():
                if attr != "marca" and attr != "modelo":
                    resp[attr].add(getattr(coche, attr))

    return resp

from fastapi import Request

@app.get("/debug")
async def debug_info(request: Request):
    return {
        "root_path": request.scope.get("root_path"),
        "path": request.scope.get("path"),
        "headers": dict(request.headers),
    }

