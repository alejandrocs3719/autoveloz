import psycopg2
from datetime import datetime
from pydantic import BaseModel

class PrecioCocheRequest(BaseModel):
    marca             : str
    modelo            : str
    wifi              : bool   
    gps               : bool   
    silla_nino        : bool   
    cadenas           : bool
    fecha_inicio      : datetime
    fecha_fin         : datetime
    id_oficina_actual : int 


def calcular_dias(fecha_inicio: datetime, fecha_fin: datetime) -> int:
    return (fecha_fin.date() - fecha_inicio.date()).days + 1

# Repite la clase con gama incluida solo para este script
def calcular_precio(req: PrecioCocheRequest):
    
    conexion = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="DhYae8vU820ZZec7AW5S",
            host="blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
            port="5432"
        )
    
    cursor = conexion.cursor()

    
    cursor.execute(
            """
            SELECT tarifa.precio
            FROM vehiculo
            JOIN tarifa ON vehiculo.id_vehiculo = tarifa.id_vehiculo
            WHERE vehiculo.marca = %s
            AND vehiculo.modelo = %s
            AND vehiculo.wifi = %s
            AND vehiculo.gps = %s
            AND vehiculo.silla_nino = %s
            AND vehiculo.cadenas = %s
            AND vehiculo.id_oficina_actual = %s
            ORDER BY tarifa.precio ASC
            LIMIT 1;



            """, (req.marca, req.modelo, req.wifi, req.gps, req.silla_nino, req.cadenas, req.id_oficina_actual)
        )
    
    precio_dia = cursor.fetchone()[0]
    cursor.close()
    conexion.close()
    
    print("\n\n\n\n\n")
    print(precio_dia)
    print("\n\n\n\n\n")
    duracion_dias = calcular_dias(req.fecha_inicio, req.fecha_fin)
    
    print("\n\n\n\n\n")
    print(duracion_dias)
    print("\n\n\n\n\n")

    
    precio_fin = -1
    
    if precio_dia:
        precio_fin = precio_dia*duracion_dias
    
   
    
    # Por el momento añadir los extras va a costar igual en todos los coches
    
    # Por el momeneto la única tarifa disponible es la de por dia
    
        
    print("\n\n\n\n\n")
    print(precio_fin)
    print("\n\n\n\n\n")

    
    return precio_fin
