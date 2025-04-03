import psycopg2


def obtener_oficinas():
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
        SELECT nombre, direccion FROM oficina;
        """
    )
    oficina_data = cursor.fetchall()
    cursor.close()
    conexion.close()

    if oficina_data:
        return [Oficina(*oficina) for oficina in oficina_data]
    else:
        return None


class Oficina:
    def __init__(self, nombre, direccion):
        self.nombre = nombre
        self.direccion = direccion


    def mostrar_info(self):
        return f"Nombre: {self.nombre}, Dirección: {self.direccion}" \


    def guardar_oficina(self):
        conexion = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="DhYae8vU820ZZec7AW5S",
            host="blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
            port="5432"
        )
        cursor = conexion.cursor()

        cursor.execute(
            f"""
        DO $$
        BEGIN
            IF (SELECT COUNT(*) FROM oficina WHERE nombre = '{self.nombre}') > 0 THEN
                NULL;
            ELSE
                INSERT INTO oficina (nombre, direccion)
                VALUES ('{self.nombre}', '{self.direccion}');
            END IF;
        END $$;
            """

        )
        conexion.commit()
        cursor.close()
        conexion.close()

lista_oficinas = obtener_oficinas()
for oficina in lista_oficinas:
    print(oficina.mostrar_info())


# Ejemplo de uso
# oficina1 = Oficina("Office03", "Calle La calle, 10, Mostoles, Madrid")
# oficina2 = Oficina(nombre="Office02", direccion="Avenida La avenida, 20, Vallecas, Madrid")
# oficina1.guardar_en_db()
# oficina2.guardar_en_db()

# oficina_recuperada = Oficina.obtener_desde_db("Office01")
# if oficina_recuperada:
#     print(oficina_recuperada.mostrar_info())

