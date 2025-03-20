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
coche1 = Coche(matricula="1234ABC", categoria="SUV", marca="Toyota", modelo="RAV4", plazas=5, techo=True, marcha="automático", puertas=5, wifi=True, gps=True, silla_nino=False, cadenas=True)
coche2 = Coche(matricula="4200EXX", categoria="SUV", marca="Hyundai", modelo="RAV4", plazas=5, techo=True, marcha="manual", puertas=5, wifi=True, gps=True, silla_nino=False, cadenas=True)
coche1.guardar_en_db()
coche2.guardar_en_db()
coche_recuperado = Coche.obtener_desde_db("4200EXX")
if coche_recuperado:
    print(coche_recuperado.mostrar_info())