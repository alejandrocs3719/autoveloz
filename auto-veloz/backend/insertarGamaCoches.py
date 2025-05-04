import psycopg2

# Repite la clase con gama incluida solo para este script
class Coche:
    def __init__(self, matricula, gama):
        self.matricula = matricula
        self.gama = gama

def insertar_gamas(coches):
    conexion = psycopg2.connect(
        dbname="postgres",
        user="postgres",
        password="DhYae8vU820ZZec7AW5S",
        host="blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
        port="5432"
    )
    cursor = conexion.cursor()

    for coche in coches:
        
        print(coche.matricula)
        
        cursor.execute("SELECT * FROM vehiculo ;")
        resultado = cursor.fetchone()
        print(resultado)
        
        cursor.execute("SELECT id_vehiculo FROM vehiculo WHERE matricula = %s", (coche.matricula,))
        resultado = cursor.fetchone()
        #print(resultado)
        
        if resultado:
            id_vehiculo = resultado[0]
            try:
                cursor.execute("""
                    INSERT INTO GamaVehiculo (id_vehiculo, gama)
                    VALUES (%s, %s)
                    ON CONFLICT (id_vehiculo) DO NOTHING;
                """, (id_vehiculo, coche.gama))
                print(f"✅ Gama '{coche.gama}' insertada para el vehículo {coche.matricula}.")
            except Exception as e:
                print(f"❌ Error al insertar gama para {coche.matricula}: {e}")
        else:
            print(f"⚠️ Vehículo no encontrado: {coche.matricula}")

    conexion.commit()
    cursor.close()
    conexion.close()

# Solo matricula y gama necesarios aquí
coches = [
    Coche("1234ABC", "alta"),
    Coche("4200EXX", "alta"),
    Coche("5678DEF", "media"),
    Coche("9101GHI", "baja"),
    Coche("1122JKL", "alta"),
    Coche("3344MNO", "alta"),
    Coche("5566PQR", "media"),
    Coche("7788STU", "alta"),
    Coche("9900VWX", "media"),
    Coche("1111YYY", "media"),
    Coche("2222ZZZ", "media"),
    Coche("3333AAA", "alta"),
    Coche("4444BBB", "media"),
    Coche("5555CCC", "media"),
    Coche("6666DDD", "media"),
    Coche("7777EEE", "alta"),
    Coche("8888FFF", "baja"),
    Coche("9999GGG", "media"),
    Coche("1010HHH", "media"),
    Coche("2020III", "alta"),
]


insertar_gamas(coches)
