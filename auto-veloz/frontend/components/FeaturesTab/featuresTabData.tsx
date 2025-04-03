import { FeatureTab } from "@/types/featureTab";

const featuresTabData: FeatureTab[] = [
  {
    id: "tabOne",
    title: "Elige el coche que mejor te convenga.",
    desc1: `Selecciona el coche que se ajuste a tus necesidades. Ofrecemos una amplia gama de vehículos, desde económicos hasta de lujo.`,
    desc2: `Con nuestra selección, podrás encontrar el coche perfecto para tu viaje, ya sea para un día de trabajo o unas vacaciones.`,
    image: "/images/cars/choosing_car.jpg",
    imageDark: "/images/cars/choosing_car.jpg",
  },
  {
    id: "tabTwo",
    title: "Añade todos los extras que necesites.",
    desc1: `Personaliza tu coche con extras como GPS, asientos adicionales, seguros, o incluso sillas para niños. Todo lo que necesites para tu comodidad.`,
    desc2: `Disponemos de una variedad de opciones para hacer tu experiencia aún más cómoda y segura durante el alquiler del coche.`,
    image: "/images/features/extras.jpg",
    imageDark: "/images/features/extras.jpg",
  },
  {
    id: "tabThree",
    title: "Elige fecha y paga al devolver el coche.",
    desc1: `Selecciona las fechas en las que necesitas el coche, y realiza tu pago cuando devuelvas el vehículo, asegurando flexibilidad en tu experiencia.`,
    desc2: `Con nuestro sistema, puedes hacer la reserva en pocos minutos y pagar cómodamente al final de tu alquiler.`,
    image: "/images/features/calendario2.webp",
    imageDark: "/images/features/calendario2.webp",
  },
];

export default featuresTabData;
