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


def calcular_dias(fecha_inicio, fecha_fin):
    inicio = datetime.strptime(fecha_inicio, "%Y-%m-%d")
    fin = datetime.strptime(fecha_fin, "%Y-%m-%d")
    return (fin - inicio).days + 1

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

    
    cursor.execute(cursor.execute(
            """
            SELECT tarifa.precio
            FROM vehiculo
            JOIN tarifa ON vehiculo.id_vehiculo = tarifa.id_vehiculo
            WHERE vehiculo.marca = %(marca)s
            AND vehiculo.modelo = %(modelo)s
            AND vehiculo.wifi = %(wifi)s
            AND vehiculo.gps = %(gps)s
            AND vehiculo.silla_nino = %(silla_nino)s
            AND vehiculo.cadenas = %(cadenas)s
            AND vehiculo.id_oficina_actual = %(id_oficina_actual)s
            ORDER BY tarifa.precio ASC
            LIMIT 1;



            """
        ))
    
    precio_dia = cursor.fetchone()
    cursor.close()
    conexion.close()
    
    duracion_dias = calcular_dias(req.fecha_inicio, req.fecha_fin)
    
    precio_fin = -1
    
    if precio_dia:
        precio_fin = precio_dia*duracion_dias
    
   
    
    # Por el momento añadir los extras va a costar igual en todos los coches
    
    # Por el momeneto la única tarifa disponible es la de por dia
    
    

    
    return precio_fin
    """
    Calcula el precio total del alquiler del coche.
    
    Parámetros:
        tipo_tarifa (str): Tipo de tarifa ('por día', 'por km', 'ilimitado', 'fin de semana', 'mensual').
        duracion_dias (int): Número de días de alquiler (cuando aplica).
        distancia_km (float): Distancia recorrida (cuando aplica).
        extras (list): Lista de extras seleccionados, por ejemplo: ['silla', 'internet'].
    
    Retorna:
        float: Precio total en euros.
    """

    # Tarifas base (en euros)
    tarifas = {
        'por día': 30.0,
        'por km': 0.50,
        'ilimitado': 100.0,
        'fin de semana': 70.0,
        'mensual': 600.0
    }

    # Costos de extras (en euros)
    costo_extras = {
        'silla': 5.0,
        'internet': 10.0
    }

    precio_base = 0.0
    duracion_dias = calcular_dias(fecha_inicio, fecha_fin)
    if tipo_tarifa == 'por día':
        precio_base = tarifas[tipo_tarifa] * duracion_dias
    elif tipo_tarifa == 'por km':
        precio_base = tarifas[tipo_tarifa] * distancia_km
    elif tipo_tarifa == 'ilimitado':
        precio_base = tarifas[tipo_tarifa]
    elif tipo_tarifa == 'fin de semana':
        precio_base = tarifas[tipo_tarifa]
    elif tipo_tarifa == 'mensual':
        precio_base = tarifas[tipo_tarifa]
    else:
        raise ValueError("Tipo de tarifa no válido.")

    # Cálculo de extras
    total_extras = sum(costo_extras[extra] for extra in (extras or []) if extra in costo_extras)

    precio_total = precio_base + total_extras
    return round(precio_total, 2)

# Ejemplo de uso
precio = calcular_precio('por día', duracion_dias=3, extras=['silla', 'internet'])
print(f"Precio total: €{precio}")
