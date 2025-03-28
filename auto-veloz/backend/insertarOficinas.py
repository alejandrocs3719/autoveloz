import psycopg2

class Oficina:
    def __init__(nombre, direccion):
        self.nombre = nombre
        self.direccion = direccion
        

    def mostrar_info(self):
        return f"Nombre: {self.nombre}, Dirección: {self.direccion}, Matriculas: {self.matriculas}" \
               

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
            INSERT INTO oficina (nombre, direccion)
            SELECT '%s', '%s'
            WHERE NOT EXISTS (
                SELECT 1 FROM oficina WHERE nombre = '%s'
            );
            
            """,
            (self.nombre, self.direccion, self.nombre)
        )
        conexion.commit()
        cursor.close()
        conexion.close()

    @staticmethod
    def obtener_desde_db(nombre):
        conexion = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="DhYae8vU820ZZec7AW5S",
            host="blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
            port="5432"
        )
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM oficina WHERE nombre = %s", (nombre))
        oficina_data = cursor.fetchone()
        cursor.close()
        conexion.close()
        
        if oficina_data:
            return Oficina(*oficina_data)
        else:
            return None

# Ejemplo de uso
oficina1 = Oficina(nombre="Office01", direccion="Calle La calle, 10, Mostoles, Madrid")
oficina2 = Oficina(nombre="Office02", direccion="Avenida La avenida, 20, Vallecas, Madrid")
oficina1.guardar_en_db()
oficina2.guardar_en_db()
oficina_recuperada = Oficina.obtener_desde_db("Office01")
if oficina_recuperada:
    print(oficina_recuperada.mostrar_info())