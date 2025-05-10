import psycopg2
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
class TipoCliente(str, Enum):
    cliente = 'cliente'
    empresa = 'empresa'
    admin = 'admin'
class ClienteLoginSalida(BaseModel):
    nombre: str
    dni: str
    fecha_nacimiento: datetime
    correo: str
    tipo_usuario: TipoCliente

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

def obtener_cliente(correo, contrasena):
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
        SELECT nombre, dni, fecha_nacimiento, correo, tipo_usuario FROM cliente WHERE correo = '{correo}' AND contrasena = '{contrasena}';
        """
    )
    cliente_data = cursor.fetchone()
    cursor.close()
    conexion.close()
    if cliente_data:
        return ClienteLoginSalida(
            nombre=cliente_data[0],
            dni=cliente_data[1],
            fecha_nacimiento=cliente_data[2],
            correo=cliente_data[3],
            tipo_usuario=cliente_data[4]
        )
    else:
        return {}

class Cliente:
    def __init__(self, id, nombre, dni, fecha_nacimiento, correo, tipo_usuario, contrasena):
        self.id = id
        self.nombre = nombre
        self.dni = dni
        self.fecha_nacimiento = fecha_nacimiento
        self.correo = correo
        self.tipo_usuario = tipo_usuario
        self.contrasena = contrasena


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
                INSERT INTO cliente (nombre, dni, fecha_nacimiento, correo, tipo_usuario, contrasena)
                VALUES ('{self.nombre}', '{self.dni}', '{self.fecha_nacimiento}', '{self.correo}', '{self.tipo_usuario.value}', '{self.contrasena}');
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
            f"""
            SELECT id FROM cliente WHERE dni = '{self.dni}'"
            """
        )
        id_cliente = cursor.fetchone()
        cursor.close()
        conexion.close()
        return id_cliente

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
            f"""
            SELECT id_cliente FROM cliente WHERE dni = '{self.dni}'
            """
        )
        id_cliente = cursor.fetchone()
        cursor.close()
        conexion.close()
        return id_cliente






