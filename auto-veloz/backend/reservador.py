import psycopg2
from datetime import datetime
from pydantic import BaseModel
import random

class CrearReservaRequest(BaseModel):
    marca             : str
    modelo            : str
    wifi              : bool   
    gps               : bool   
    silla_nino        : bool   
    cadenas           : bool
    correo             : str
    id_oficina_origen  : int  
    id_oficina_destino : int  
    fecha_inicio       : datetime
    fecha_fin          : datetime
    tarjeta_credito    : str
    precio_total       : float
    


class CrearReservaRequestDoy(BaseModel):
    id_cliente : int
    id_vehiculo : int
    

#la de origen es la actual del coche

def crear_reserva(req: CrearReservaRequest):
    
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
            SELECT id_vehiculo
            FROM vehiculo
            WHERE marca = %s
            AND modelo = %s
            AND wifi = %s
            AND gps = %s
            AND silla_nino = %s
            AND cadenas = %s
            AND id_oficina_actual = %s
            ;""",
            ( req.marca ,req.modelo, req.wifi, req.gps, req.silla_nino, req.cadenas, req.id_oficina_origen)
    )

    id_vehiculo =  cursor.fetchone()[0]
    
    print("\n\n TODO BIEN PEÑA\n\n ")
    
    cursor.execute(
            """
            SELECT id_cliente
            FROM cliente
            WHERE correo = %s
            ;""",
            ( req.correo,)
    )
    
    print("\n\n DE LOCOS\n\n ")
    
    id_cliente =  cursor.fetchone()[0]
    
    id_reserva = random.randint(1, 10000)
    #print("\n\n Aqui va el id\n\n ")
    #print(id_reserva)
    
    
    #print( id_reserva ,id_vehiculo, id_cliente, req.id_oficina_origen, req.id_oficina_destino, req.fecha_inicio, req.fecha_fin, req.precio_total)
    # Me daran nombre de usuario?
    
    cursor.execute(
            """
            INSERT INTO reserva (id_reserva, id_vehiculo,  id_cliente, id_oficina_origen, id_oficina_destino, fecha_inicio, fecha_fin, tarjeta_credito, precio_total)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id_reserva) DO NOTHING
            """,
            ( id_reserva ,id_vehiculo, id_cliente, req.id_oficina_origen, req.id_oficina_destino, req.fecha_inicio, req.fecha_fin, req.tarjeta_credito, req.precio_total)
    )
    
    conexion.commit()
    cursor.close()
    conexion.close()
    
    datos_cuelta = [id_cliente, id_vehiculo]
    
    return datos_cuelta
