"use client";

import { useState } from "react";

// Simulated data in the frontend
let carsData = [
  {
    id: 1,
    name: "Dacia Sandero",
    image: "/images/cars/coche.png",
    monthly: "157 €/mes",
    fuel: "Gasolina",
    km: "79.417 km",
    transmission: "Manual",
  },
  {
    id: 2,
    name: "BMW Serie 4",
    image: "/images/cars/coche.png",
    monthly: "356 €/mes",
    fuel: "Diésel",
    km: "102.126 km",
    transmission: "Automático",
  },
  {
    id: 3,
    name: "Peugeot 208",
    image: "/images/cars/coche.png",
    monthly: "222 €/mes",
    fuel: "Diésel",
    km: "32.634 km",
    transmission: "Manual",
  },
];

export default function CochesPage() {
  const [cars, setCars] = useState(carsData.slice(0, 3));
  const [visibleCount, setVisibleCount] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCar, setNewCar] = useState({
    name: "",
    image: "",
    monthly: "",
    fuel: "",
    km: "",
    transmission: "",
  });

  const handleLoadMore = () => {
    const next = carsData.slice(0, visibleCount + 3);
    setCars(next);
    setVisibleCount(visibleCount + 3);
  };

  // Función modificada
  const handleAddCar = () => {
    // Comprobar que todos los campos estén rellenados
    if (
      !newCar.name ||
      !newCar.monthly ||
      !newCar.fuel ||
      !newCar.km ||
      !newCar.transmission
    ) {
      setErrorMessage("Por favor, rellene todos los campos.");
      return;
    }

    // Si todo está bien, se añade el coche
    const newId = carsData.length + 1;
    const car = { id: newId, ...newCar };
    carsData.push(car);
    setCars(carsData.slice(0, visibleCount + 1));
    setNewCar({
      name: "",
      image: "",
      monthly: "",
      fuel: "",
      km: "",
      transmission: "",
    });
    setShowPopup(false);
    setErrorMessage(""); // Limpiar mensaje de error
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      for (let line of lines) {
        // Expected CSV format: name,image,price,monthly,year,fuel,km,transmission
        const [name, image, price, monthly, year, fuel, km, transmission] = line.split(",");
        if (name && image && price && monthly && year && fuel && km && transmission) {
          const newId = carsData.length + 1;
          const car = {
            id: newId,
            name: name.trim(),
            image: image.trim(),
            monthly: monthly.trim(),
            fuel: fuel.trim(),
            km: km.trim(),
            transmission: transmission.trim(),
          };
          carsData.push(car);
        }
      }
      setCars(carsData.slice(0, visibleCount + 3));
      setShowPopup(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Coches Disponibles
        </h1>

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nombre</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Combustible</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Km</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Transmisión</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.id}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.name}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.fuel}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.km}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.transmission}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < carsData.length && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Cargar más
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Añadir Coche
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Añadir Nuevo Coche
              </h2>

              <input
                type="text"
                placeholder="Nombre del coche"
                value={newCar.name}
                onChange={(e) =>
                  setNewCar({ ...newCar, name: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Cuota mensual"
                value={newCar.monthly}
                onChange={(e) =>
                  setNewCar({ ...newCar, monthly: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <select
                value={newCar.fuel}
                onChange={(e) =>
                  setNewCar({ ...newCar, fuel: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              >
                <option value="" disabled>
                  Combustible
                </option>
                <option value="Diesel">Diesel</option>
                <option value="Gasolina">Gasolina</option>
              </select>

              <input
                type="number"
                placeholder="Kilómetros"
                value={newCar.km}
                onChange={(e) =>
                  setNewCar({ ...newCar, km: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <select
                value={newCar.transmission}
                onChange={(e) =>
                  setNewCar({ ...newCar, transmission: e.target.value })
                }
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              >
                <option value="" disabled>
                  Transmisión
                </option>
                <option value="Manual">Manual</option>
                <option value="Automático">Automático</option>
              </select>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAddCar}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                  Guardar
                </button>
                <label className="text-sm text-black dark:text-white">
                  o subir CSV (nombre, cuota, combustible, km, transmisión):
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="block mt-2 text-sm text-black dark:text-white"
                  />
                </label>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
