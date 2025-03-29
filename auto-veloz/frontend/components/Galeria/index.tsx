import Image from "next/image";
import Link from "next/link";

const cars = [
  {
    id: 1,
    name: "Dacia Sandero",
    image: "/images/cars/coche.png",
    price: "10.299 €",
    monthly: "157 €/mes",
    year: "2018",
    fuel: "Gasolina",
    km: "79.417 km",
    transmission: "Manual",
  },
  {
    id: 2,
    name: "BMW Serie 4",
    image: "/images/cars/coche.png",
    price: "22.299 €",
    monthly: "356 €/mes",
    year: "2017",
    fuel: "Diésel",
    km: "102.126 km",
    transmission: "Automático",
  },
  {
    id: 3,
    name: "Peugeot 208",
    image: "/images/cars/coche.png",
    price: "14.475 €",
    monthly: "222 €/mes",
    year: "2022",
    fuel: "Diésel",
    km: "32.634 km",
    transmission: "Manual",
  },
];

const GaleriaCoches = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Búsquedas más populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-gray-700"
            >
              <div className="relative w-full h-48">
                <Image
                  src={car.image}
                  alt={car.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-lg font-bold mt-3 text-gray-800 dark:text-white">
                {car.name}
              </h3>
              <p className="text-primary text-xl font-semibold">
                {car.price}
              </p>
              <p className="text-gray-500 dark:text-gray-300">{car.monthly}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {car.year} • {car.fuel} • {car.km} • {car.transmission}
              </p>
              <Link href={`/coches/${car.id}`} key={car.id}>
                <button className="mt-4 bg-orange-500 dark:bg-orange-600 text-white w-full py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700">
                  Ver este coche
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GaleriaCoches;
