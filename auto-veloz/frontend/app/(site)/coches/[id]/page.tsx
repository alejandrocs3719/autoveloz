"use client";

import L from "leaflet";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cars, Car } from "../data/cars";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const carIcon = L.icon({
    iconUrl: "/images/cars/coche.png",
    iconSize: [32, 32], // tamaño del icono
    iconAnchor: [16, 32], // punto del icono que se corresponde con la ubicación
    popupAnchor: [0, -32], // punto desde el cual se abre el popup
  });

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);

  // Coordenadas de la Estación del Arte, Madrid
  const mapCenter: [number, number] = [40.4085, -3.6922];

  useEffect(() => {
    const found = cars.find((c) => c.id.toString() === id);
    setCar(found ?? null);
  }, [id]);

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
              {car.features.map((f, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-1 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
            <button className="mt-6 px-6 py-3 bg-primary text-white rounded-md">
              Reservar coche
            </button>
          </div>
        </div>

        {/* Mapa con Leaflet */}
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