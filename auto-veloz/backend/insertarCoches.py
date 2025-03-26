import psycopg2

class Coche:
    def __init__(self, matricula, categoria, marca, modelo, plazas, techo, marcha, puertas, wifi, gps, silla_nino, cadenas):
        self.matricula = matricula
        self.categoria = categoria
        self.marca = marca
        self.modelo = modelo
        self.plazas = plazas
        self.techo = techo  # Puede ser True (tiene techo corredizo) o False
        self.marcha = marcha  # 'manual' o 'automático'
        self.puertas = puertas
        self.wifi = wifi  # True o False
        self.gps = gps  # True o False
        self.silla_nino = silla_nino  # True o False
        self.cadenas = cadenas  # True o False

    def mostrar_info(self):
        return f"Matrícula: {self.matricula}, Categoría: {self.categoria}, Marca: {self.marca}, Modelo: {self.modelo}, " \
               f"Plazas: {self.plazas}, Techo: {'Sí' if self.techo else 'No'}, Marcha: {self.marcha}, Puertas: {self.puertas}, " \
               f"WiFi: {'Sí' if self.wifi else 'No'}, GPS: {'Sí' if self.gps else 'No'}, " \
               f"Silla Niño: {'Sí' if self.silla_nino else 'No'}, Cadenas: {'Sí' if self.cadenas else 'No'}"

    def guardar_en_db(self):
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
            INSERT INTO coches (matricula, categoria, marca, modelo, plazas, techo, marcha, puertas, wifi, gps, silla_nino, cadenas)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (matricula) DO NOTHING
            """,
            (self.matricula, self.categoria, self.marca, self.modelo, self.plazas, self.techo, self.marcha, self.puertas, self.wifi, self.gps, self.silla_nino, self.cadenas)
        )
        conexion.commit()
        cursor.close()
        conexion.close()

    @staticmethod
    def obtener_desde_db(matricula):
        conexion = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="DhYae8vU820ZZec7AW5S",
            host="blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
            port="5432"
        )
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM coches WHERE matricula = %s", (matricula,))
        coche_data = cursor.fetchone()
        cursor.close()
        conexion.close()
        
        if coche_data:
            return Coche(*coche_data)
        else:
            return None

# Ejemplo de uso
coches = [
    Coche("1234ABC", "SUV", "Toyota", "RAV4", 5, True, "automático", 5, True, True, False, True),
    Coche("4200EXX", "SUV", "Hyundai", "Tucson", 5, True, "manual", 5, True, True, False, True),
    Coche("5678DEF", "Sedán", "Honda", "Civic", 5, False, "automático", 4, True, True, True, False),
    Coche("9101GHI", "Hatchback", "Ford", "Focus", 5, False, "manual", 4, False, True, False, False),
    Coche("1122JKL", "Coupé", "BMW", "Serie 4", 4, True, "automático", 2, True, True, False, False),
    Coche("3344MNO", "SUV", "Mercedes", "GLA", 5, True, "automático", 5, True, True, True, True),
    Coche("5566PQR", "Pickup", "Chevrolet", "Silverado", 5, False, "manual", 4, False, True, False, True),
    Coche("7788STU", "Sedán", "Audi", "A4", 5, True, "automático", 4, True, True, False, False),
    Coche("9900VWX", "Convertible", "Mazda", "MX-5", 2, True, "manual", 2, False, False, False, False),
    Coche("1111YYY", "SUV", "Nissan", "X-Trail", 7, True, "automático", 5, True, True, True, True),
    Coche("2222ZZZ", "Hatchback", "Volkswagen", "Golf", 5, False, "manual", 4, True, False, True, False),
    Coche("3333AAA", "Sedán", "Tesla", "Model S", 5, True, "automático", 4, True, True, True, False),
    Coche("4444BBB", "SUV", "Jeep", "Wrangler", 4, False, "manual", 3, False, True, False, True),
    Coche("5555CCC", "Minivan", "Kia", "Carnival", 7, True, "automático", 5, True, True, True, True),
    Coche("6666DDD", "Pickup", "Ford", "F-150", 5, False, "automático", 4, False, True, False, True),
    Coche("7777EEE", "Coupé", "Porsche", "911", 2, True, "automático", 2, True, True, False, False),
    Coche("8888FFF", "Hatchback", "Toyota", "Yaris", 5, False, "manual", 4, False, False, True, False),
    Coche("9999GGG", "Sedán", "Hyundai", "Elantra", 5, False, "automático", 4, True, True, False, False),
    Coche("1010HHH", "SUV", "Subaru", "Forester", 5, True, "manual", 5, True, True, True, True),
    Coche("2020III", "Convertible", "BMW", "Z4", 2, True, "automático", 2, True, False, False, False)
]

for coche in coches:
    coche.guardar_en_db()
    print(coche.mostrar_info())

coche_recuperado = Coche.obtener_desde_db("4200EXX")
if coche_recuperado:
    print(coche_recuperado.mostrar_info())