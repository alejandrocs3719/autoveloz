"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const API_LISTA = "http://13.48.84.201:8000/api/getCoches";
const API_DETALLE = "http://13.48.84.201:8000/api/getExtrasCoche";
const API_PUT = "http://13.48.84.201:8000/api/putCoches";

export default function CochesPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCar, setNewCar] = useState({
    matricula: "",
    categoria: "",
    marca: "",
    modelo: "",
    plazas: 0,
    techo: false,
    marcha: "",
    puertas: 0,
    wifi: false,
    gps: false,
    silla_nino: false,
    cadenas: false,
    id_oficina_actual: 0,
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(API_LISTA);
        const data = await res.json();

        const cochesValidos = data.coches.filter(
          ([marca, modelo]: [string, string]) => marca && modelo
        );

        const detalles = await Promise.all(
          cochesValidos.map(async ([marca, modelo]: [string, string]) => {
            try {
              const detalleRes = await fetch(API_DETALLE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ marca, modelo }),
              });
              const detalle = await detalleRes.json();

              return {
                id: `${marca}-${modelo}`,
                name: `${marca} ${modelo}`,
                categoria: detalle.categoria?.[0] || "-",
                plazas: detalle.plazas?.[0] || "-",
                transmission: detalle.marcha?.[0] || "-",
                image: "/images/cars/coche.png",
              };
            } catch (err) {
              console.error("Error cargando detalles de:", marca, modelo, err);
              return null;
            }
          })
        );

        const unicosPorModelo = new Map();

        detalles.forEach((car) => {
          if (car && !unicosPorModelo.has(car.id)) {
            unicosPorModelo.set(car.id, car);
          }
        });

        setCars(Array.from(unicosPorModelo.values()));

      } catch (err) {
        console.error("Error al obtener la lista de coches:", err);
      }
    };

    fetchCars();
  }, []);

  const handleAddCar = async () => {
    try {
      const res = await fetch(API_PUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCar),
      });

      if (!res.ok) throw new Error("Error al añadir coche");

      setNewCar({
        matricula: "",
        categoria: "",
        marca: "",
        modelo: "",
        plazas: 0,
        techo: false,
        marcha: "",
        puertas: 0,
        wifi: false,
        gps: false,
        silla_nino: false,
        cadenas: false,
        id_oficina_actual: 0,
      });
      setShowPopup(false);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Hubo un error al añadir el coche.");
      console.error(err);
    }
  };

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(search.toLowerCase()) ||
    car.categoria.toLowerCase().includes(search.toLowerCase()) ||
    car.transmission.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Coches Disponibles
        </h1>

        <input
          type="text"
          placeholder="Buscar coche, categoría o transmisión..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 px-4 py-2 w-full rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
        />

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nombre</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Categoría</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Plazas</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Transmisión</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.slice(0, visibleCount).map((car) => (
              <tr key={car.id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.name}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.categoria}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.plazas}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{car.transmission}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < filteredCars.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
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
            <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-md h-[60vh] overflow-y-auto shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Añadir Nuevo Coche
              </h2>
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Añadir Nuevo Coche
              </h2>

              <label className="block mb-1 text-black dark:text-white">Matrícula</label>
              <input type="text" placeholder="Ej: 1234ABC" value={newCar.matricula} onChange={(e) => setNewCar({ ...newCar, matricula: e.target.value })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Categoría</label>
              <input type="text" placeholder="Ej: SUV" value={newCar.categoria} onChange={(e) => setNewCar({ ...newCar, categoria: e.target.value })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Marca</label>
              <input type="text" placeholder="Ej: Toyota" value={newCar.marca} onChange={(e) => setNewCar({ ...newCar, marca: e.target.value })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Modelo</label>
              <input type="text" placeholder="Ej: Corolla" value={newCar.modelo} onChange={(e) => setNewCar({ ...newCar, modelo: e.target.value })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Número de plazas</label>
              <input type="number" placeholder="Ej: 5" value={newCar.plazas} onChange={(e) => setNewCar({ ...newCar, plazas: Number(e.target.value) })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Tipo de marcha</label>
              <input type="text" placeholder="Ej: Automática" value={newCar.marcha} onChange={(e) => setNewCar({ ...newCar, marcha: e.target.value })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">Número de puertas</label>
              <input type="number" placeholder="Ej: 4" value={newCar.puertas} onChange={(e) => setNewCar({ ...newCar, puertas: Number(e.target.value) })} className="w-full mb-3 ..." />

              <label className="block mb-1 text-black dark:text-white">ID de oficina actual</label>
              <input type="number" placeholder="Ej: 1" value={newCar.id_oficina_actual} onChange={(e) => setNewCar({ ...newCar, id_oficina_actual: Number(e.target.value) })} className="w-full mb-3 ..." />


              <div className="flex flex-col gap-2 text-black dark:text-white text-sm mb-4">
                <label><input type="checkbox" checked={newCar.techo} onChange={(e) => setNewCar({ ...newCar, techo: e.target.checked })} /> Techo solar</label>
                <label><input type="checkbox" checked={newCar.wifi} onChange={(e) => setNewCar({ ...newCar, wifi: e.target.checked })} /> Wi-Fi</label>
                <label><input type="checkbox" checked={newCar.gps} onChange={(e) => setNewCar({ ...newCar, gps: e.target.checked })} /> GPS</label>
                <label><input type="checkbox" checked={newCar.silla_nino} onChange={(e) => setNewCar({ ...newCar, silla_nino: e.target.checked })} /> Silla niño</label>
                <label><input type="checkbox" checked={newCar.cadenas} onChange={(e) => setNewCar({ ...newCar, cadenas: e.target.checked })} /> Cadenas</label>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <div className="flex flex-col gap-4">
                <button onClick={handleAddCar} className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
                  Guardar
                </button>
                <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
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

