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
    CREATE TABLE IF NOT EXISTS coches (
        matricula VARCHAR(10) PRIMARY KEY,
        categoria VARCHAR(50),
        marca VARCHAR(50),
        modelo VARCHAR(50),
        plazas INTEGER,
        techo BOOLEAN,
        marcha VARCHAR(20),
        puertas INTEGER,
        wifi BOOLEAN,
        gps BOOLEAN,
        silla_nino BOOLEAN,
        cadenas BOOLEAN
    );
    """

    # Ejecutar la query
    cursor.execute(create_table_query)
    conexion.commit()

    print("✅ Tabla 'coches' creada correctamente (si no existía).")

except Exception as e:
    print(f"❌ Error al crear la tabla: {e}")

finally:
    # Cerrar conexión
    if cursor:
        cursor.close()
    if conexion:
        conexion.close()
