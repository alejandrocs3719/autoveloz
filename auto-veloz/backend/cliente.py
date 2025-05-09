import psycopg2

def obtener_clientes():
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
        SELECT * FROM cliente;
        """
    )
    cliente_data = cursor.fetchall()
    cursor.close()
    conexion.close()

    if cliente_data:
        return [Cliente(*cliente) for cliente in cliente_data]
    else:
        return None



class Cliente:
    def __init__(self, id, nombre, dni, fecha_nacimiento, correo, tipo_cliente):
        self.id = id
        self.nombre = nombre
        self.dni = dni
        self.fecha_nacimiento = fecha_nacimiento
        self.correo = correo
        self.tipo_cliente = tipo_cliente


    def mostrar_info(self):
        return f"Nombre: {self.nombre}, Dni: {self.dni}"


    def guardar_cliente(self):
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
            IF (SELECT COUNT(*) FROM cliente WHERE dni = '{self.dni}') > 0 THEN
                NULL;
            ELSE
                INSERT INTO cliente (nombre, dni, fecha_nacimiento, correo, tipo_cliente)
                VALUES ('{self.nombre}', '{self.dni}', '{self.fecha_nacimiento}', '{self.correo}', '{self.tipo_cliente}');
            END IF;
        END $$;
            """

        )
        conexion.commit()
        cursor.close()
        conexion.close()
        self.id = self._get_id()

    def _get_id(self):
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
            SELECT id FROM cliente WHERE dni = "
            """
            + self.dni
        )
        id_cliente = cursor.fetchone()
        cursor.close()
        conexion.close()
        return id_cliente






