"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_LISTA = "http://13.48.84.201:8000/api/getCoches";
const API_DETALLE = "http://13.48.84.201:8000/api/getExtrasCoche";

const CarSearchPage = () => {
  const searchParams = useSearchParams();
  const marcaSeleccionada = searchParams.get("marca");

  const [search, setSearch] = useState(marcaSeleccionada || "");
  const [allCars, setAllCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

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

              if (
                !detalle?.categoria?.[0] ||
                !detalle?.plazas?.[0] ||
                !detalle?.marcha?.[0]
              ) {
                return null;
              }

              return {
                id: `${marca}-${modelo}`,
                name: `${marca} ${modelo}`,
                description: `${detalle.categoria[0]} con ${detalle.plazas[0]} plazas y transmisión ${detalle.marcha[0]}`,
                features: [
                  detalle.puertas?.[0] ? `${detalle.puertas[0]} puertas` : "",
                  detalle.techo?.[0] ? "Techo solar" : "",
                  detalle.wifi?.[0] ? "Wi-Fi" : "",
                  detalle.gps?.[0] ? "GPS" : "",
                  detalle.silla_nino?.[0] ? "Silla para niños" : "",
                  detalle.cadenas?.[0] ? "Cadenas para nieve" : "",
                ].filter(Boolean),
                image: "/images/cars/coche.png"
              };
            } catch (err) {
              console.error(`Error al obtener detalle de ${marca} ${modelo}:`, err);
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

        setAllCars(Array.from(unicosPorModelo.values()));

      } catch (err) {
        console.error("Error al obtener la lista de coches:", err);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = allCars.filter(
      (car) =>
        car.name.toLowerCase().includes(lower) ||
        car.description.toLowerCase().includes(lower) ||
        car.features.some((f: string) => f.toLowerCase().includes(lower))
    );
    setFilteredCars(filtered.slice(0, visibleCount));
  }, [search, visibleCount, allCars]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Buscador de Coches</h1>
        <input
          type="text"
          placeholder="Busca por nombre o característica..."
          className="w-full mb-8 px-4 py-3 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredCars.map((car) => (
            <Link href={`/coches/${car.id}`} key={car.id}>
              <div className="cursor-pointer rounded-lg border border-stroke dark:border-strokedark bg-white dark:bg-black p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">{car.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{car.description}</p>
                <ul className="flex flex-wrap gap-2 mt-3">
                  {car.features.map((f: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-2 py-1 rounded"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        {filteredCars.length < allCars.filter(
          (car) =>
            car.name.toLowerCase().includes(search.toLowerCase()) ||
            car.description.toLowerCase().includes(search.toLowerCase()) ||
            car.features.some((f: string) => f.toLowerCase().includes(search.toLowerCase()))
        ).length && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Cargar más
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default CarSearchPage;

