"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const API_LISTA = "http://13.48.84.201:8000/api/getCoches";
const API_DETALLE = "http://13.48.84.201:8000/api/getExtrasCoche";

const GaleriaCoches = () => {
  const [cars, setCars] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(API_LISTA);
        const data = await res.json();

        const cochesValidos = data.coches.filter(
          ([marca, modelo]: [string, string]) => marca && modelo
        );

        const gruposUnicos: { [key: string]: boolean } = {};

        const detalles = await Promise.all(
          cochesValidos.map(async ([marca, modelo]: [string, string]) => {
            const clave = `${marca}-${modelo}`;
            if (gruposUnicos[clave]) return null;
            gruposUnicos[clave] = true;

            try {
              const detalleRes = await fetch(API_DETALLE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ marca, modelo }),
              });
              const detalle = await detalleRes.json();

              return {
                id: clave,
                name: `${marca} ${modelo}`,
                categoria: detalle.categoria?.[0] || "",
                plazas: detalle.plazas?.[0] || "",
                transmission: detalle.marcha?.[0] || "",
                extras: [
                  detalle.techo?.[0] && "Techo solar",
                  detalle.wifi?.[0] && "Wi-Fi",
                  detalle.gps?.[0] && "GPS",
                  detalle.silla_nino?.[0] && "Silla niño",
                  detalle.cadenas?.[0] && "Cadenas"
                ].filter(Boolean),
                image: "/images/cars/coche.png",
              };
            } catch (err) {
              console.error("Error cargando detalles de:", marca, modelo);
              return null;
            }
          })
        );

        setCars(detalles.filter(Boolean));
      } catch (err) {
        console.error("Error cargando coches:", err);
      }
    };

    fetchCars();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Búsquedas más populares
        </h2>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-full z-10"
          >
            ◀
          </button>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-8"
          >
            {cars.map((car) => (
              <div
                key={car.id}
                className="min-w-[280px] max-w-xs flex-shrink-0 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-48">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold mt-3 text-gray-800 dark:text-white">
                    {car.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {car.categoria} • {car.plazas} plazas • {car.transmission}
                  </p>
                  <ul className="flex flex-wrap gap-1 text-xs text-gray-700 dark:text-gray-300 min-h-[1.5rem] mb-4">
                    {car.extras.map((extra: string, i: number) => (
                      <li key={i} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {extra}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/coches/${car.id}`}>
                  <button className="mt-2 bg-orange-500 dark:bg-orange-600 text-white w-full py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700">
                    Ver este coche
                  </button>
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-full z-10"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};

export default GaleriaCoches;

