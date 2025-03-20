# testing jaime

class Coche:
    def __init__(self, matricula, categoria, marca, modelo, plazas, techo, marcha, puertas, wifi, gps, silla_nino, cadenas):
        self.matricula = matricula #String
        self.categoria = categoria #String
        self.marca = marca #String
        self.modelo = modelo #String
        self.plazas = plazas #Integer
        self.techo = techo  #Boolean
        self.marcha = marcha  #String (manual o automático)
        self.puertas = puertas #Integer
        self.wifi = wifi  #Boolean
        self.gps = gps  #Boolean
        self.silla_nino = silla_nino  #Boolean
        self.cadenas = cadenas  #Boolean

    def mostrar_info(self):
        return f"Matrícula: {self.matricula}, Categoría: {self.categoria}, Marca: {self.marca}, Modelo: {self.modelo}, " \
               f"Plazas: {self.plazas}, Techo: {'Sí' if self.techo else 'No'}, Marcha: {self.marcha}, Puertas: {self.puertas}, " \
               f"WiFi: {'Sí' if self.wifi else 'No'}, GPS: {'Sí' if self.gps else 'No'}, " \
               f"Silla Niño: {'Sí' if self.silla_nino else 'No'}, Cadenas: {'Sí' if self.cadenas else 'No'}"

# Ejemplo de uso
coche1 = Coche("1234ABC", "SUV", "Toyota", "RAV4", 5, True, "automático", 5, True, True, False, True)
print(coche1.mostrar_info())