import psycopg2

# Datos de conexión
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "DhYae8vU820ZZec7AW5S",
    "host": "blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com",
    "port": "5432"
}

# Crear conexión
try:
    conexion = psycopg2.connect(**DB_CONFIG)
    cursor = conexion.cursor()

    # Query para crear la tabla
    create_table_query = """
    CREATE TABLE IF NOT EXISTS oficinas (
        nombre VARCHAR(10) PRIMARY KEY,
        direccion VARCHAR(50),
        matriculas TEXT[]
    );
    """

    # Ejecutar la query
    cursor.execute(create_table_query)
    conexion.commit()

    print("✅ Tabla 'oficinas' creada correctamente (si no existía).")

except Exception as e:
    print(f"❌ Error al crear la tabla: {e}")

finally:
    # Cerrar conexión
    if cursor:
        cursor.close()
    if conexion:
        conexion.close()

