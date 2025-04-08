"use client";

import L from "leaflet";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Switch } from "@/components/ui/switch";

const API_DETALLE = "http://13.48.84.201:8000/api/getExtrasCoche";

const carIcon = L.icon({
  iconUrl: "/images/cars/coche.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const extrasLabels: Record<string, string> = {
  techo: "Techo solar",
  silla_nino: "Silla niño",
};

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState<any | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});

  const mapCenter: [number, number] = [40.4085, -3.6922];

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      const [marca, ...modeloParts] = decodeURIComponent(id as string).split("-");
      const modelo = modeloParts.join("-");

      try {
        const res = await fetch(API_DETALLE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marca, modelo }),
        });

        const data = await res.json();
        console.log("Datos del coche:", data);

        const coche = {
          id,
          name: `${marca} ${modelo}`,
          description: `${data.categoria?.[0]} con ${data.plazas?.[0]} plazas y transmisión ${data.marcha?.[0]}`,
          features: [
            data.puertas?.[0] ? `${data.puertas[0]} puertas` : "",
          ].filter(Boolean),
          extras: {
            techo: data.techo,
            wifi: data.wifi,
            gps: data.gps,
            silla_nino: data.silla_nino,
            cadenas: data.cadenas,
          },
          image: "/images/cars/coche.png",
        };

        setCar(coche);

        const extrasEstado = Object.fromEntries(
          Object.entries(coche.extras).map(([key, valores]) => {
            const opciones = valores as boolean[];
            return [key, opciones?.includes(true)];
          })
        );

        setSelectedExtras(extrasEstado);
      } catch (err) {
        console.error("Error al obtener los datos del coche:", err);
        setCar(null);
      }
    };

    fetchCar();
  }, [id]);

  const toggleExtra = (key: string) => {
    setSelectedExtras((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!car) return <p className="text-center mt-20">Coche no encontrado</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-40 pb-10 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 mb-10">
          {/* Imagen */}
          <div className="lg:w-1/2">
            <Image
              src={car.image}
              alt={car.name}
              width={600}
              height={400}
              className="rounded-md object-cover w-full"
            />
          </div>

          {/* Detalles */}
          <div className="lg:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold">{car.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{car.description}</p>
            <div className="flex flex-wrap gap-2">
              {car.features.map((f: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Extras */}
            <div className="mt-6 space-y-3">
              {Object.entries(car.extras).map(([key, values]) => {
                if (!Array.isArray(values) || values.length === 0) return null;

                const opciones = values as boolean[];
                const label = extrasLabels[key] ?? key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                const esElegible = opciones.includes(true) && opciones.includes(false);
                const esFijoTrue = opciones.length === 1 && opciones[0] === true;
                const esFijoFalse = opciones.length === 1 && opciones[0] === false;

                if (esElegible) {
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-800 dark:text-gray-200">{label}</span>
                      <Switch
                        checked={selectedExtras[key]}
                        onCheckedChange={() => toggleExtra(key)}
                      />
                    </div>
                  );
                }

                if (esFijoTrue || esFijoFalse) {
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-800 dark:text-gray-200">{label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {esFijoTrue ? "Incluido" : "No disponible"}
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>


            <button className="mt-6 px-6 py-3 bg-primary text-white rounded-md">
              Reservar coche
            </button>
          </div>
        </div>

        {/* Mapa */}
        <div className="w-full h-[400px] rounded-md overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={16}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapCenter} icon={carIcon}>
              <Popup>Estación del Arte - Ubicación del coche</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;

