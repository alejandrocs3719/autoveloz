from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "fastapi va que te cagas"}

@app.get("/api/saludo")
def saludo():
    return {"saludo": "sex!!!!!!!!!"}
