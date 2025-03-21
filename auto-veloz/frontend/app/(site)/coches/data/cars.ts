export type Car = {
    id: number;
    name: string;
    image: string;
    description: string;
    features: string[];
  };
  
  export const cars: Car[] = [
    {
      id: 1,
      name: "Tesla Model S",
      image: "/images/cars/coche.png",
      description: "Eléctrico, automático, 5 plazas",
      features: ["eléctrico", "automático", "5 plazas"]
    },
    {
      id: 2,
      name: "BMW Serie 3",
      image: "/images/cars/coche.png",
      description: "Gasolina, manual, 5 plazas",
      features: ["gasolina", "manual", "5 plazas"]
    },
    {
      id: 3,
      name: "Audi Q5",
      image: "/images/cars/coche.png",
      description: "Diésel, automático, SUV",
      features: ["diésel", "automático", "SUV"]
    },
    {
      id: 4,
      name: "Renault Clio",
      image: "/images/cars/coche.png",
      description: "Gasolina, manual, compacto",
      features: ["gasolina", "manual", "compacto"]
    },
    {
      id: 5,
      name: "Peugeot 208",
      image: "/images/cars/coche.png",
      description: "Eléctrico, automático, urbano",
      features: ["eléctrico", "automático", "urbano"]
    },
    {
      id: 6,
      name: "Mercedes Clase A",
      image: "/images/cars/coche.png",
      description: "Gasolina, automático, premium",
      features: ["gasolina", "automático", "premium"]
    },
    {
      id: 7,
      name: "Volkswagen Golf",
      image: "/images/cars/coche.png",
      description: "Híbrido, automático, compacto",
      features: ["híbrido", "automático", "compacto"]
    },
    {
      id: 8,
      name: "Seat León",
      image: "/images/cars/coche.png",
      description: "Gasolina, manual, 5 puertas",
      features: ["gasolina", "manual", "5 puertas"]
    },
    {
      id: 9,
      name: "Kia Sportage",
      image: "/images/cars/coche.png",
      description: "Diésel, automático, SUV",
      features: ["diésel", "automático", "SUV"]
    },
    {
      id: 10,
      name: "Hyundai Ioniq",
      image: "/images/cars/coche.png",
      description: "Eléctrico, automático, híbrido",
      features: ["eléctrico", "automático", "híbrido"]
    }
  ];