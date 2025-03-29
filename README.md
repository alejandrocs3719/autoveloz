# autoveloz

CONECTAR BASE DE DATOS:

Punto de enlace
blablacardb.cjucoqgasy0s.eu-north-1.rds.amazonaws.com

Puerto
5432

Nombre de usuario maestro
postgres

Contraseña maestra
DhYae8vU820ZZec7AW5S


EC2

IP publica
13.48.84.201

usuario predeterminado es ubuntu

el .pem esta en el drive



IMPORTAR psycog2 (Windows):

pip install psycopg2-binary

INICIAR FASTAPI (desde carpeta backend):

uvicorn main.app --reload
