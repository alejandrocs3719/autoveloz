"use client";

import { useAuth } from "@/components/Auth/AuthContext";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_CON_EXTRAS = "http://13.48.84.201:8000/api/getCochesConExtras";
const API_OFICINAS = "http://13.48.84.201:8000/api/getOficinas";
const API_OFICINA_COCHE = "http://13.48.84.201:8000/api/getOficinaCoche";
const API_PRECIO = "http://13.48.84.201:8000/api/getPrecio";

const carIcon = L.icon({
  iconUrl: "/images/cars/coche.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const extrasLabels: Record<string, string> = {
  techo: "Techo solar",
  wifi: "WiFi",
  gps: "GPS",
  silla_nino: "Silla niño",
  cadenas: "Cadenas",
};

type Extras = Record<string, boolean>;

function extrasToString(extras: Extras): string {
  return Object.entries(extras)
    .filter(([, val]) => val)
    .map(([key]) => extrasLabels[key] ?? key)
    .sort()
    .join(" | ");
}

function extrasEqual(a: Extras, b: Extras): boolean {
  return Object.keys(a).every((key) => a[key] === b[key]);
}

const CarDetailPage = () => {
  const { id } = useParams();
  const [coches, setCoches] = useState<any[]>([]);
  const [uniqueConfigs, setUniqueConfigs] = useState<Extras[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<Extras | null>(null);
  const [allOficinas, setAllOficinas] = useState<any[]>([]);
  const [oficinasDisponibles, setOficinasDisponibles] = useState<any[]>([]);
  const [selectedOficinaId, setSelectedOficinaId] = useState<number | null>(null);
  const [selectedDepositoId, setSelectedDepositoId] = useState<number | null>(null);
  const [fechaRecogida, setFechaRecogida] = useState<Date | null>(null);
  const [fechaDeposito, setFechaDeposito] = useState<Date | null>(null);
  const [precioTotal, setPrecioTotal] = useState<number | null>(null);
  const [oficinaCoords, setOficinaCoords] = useState<[number, number] | null>(null);
  const fallbackMapCenter: [number, number] = [40.4085, -3.6922];


  const { user } = useAuth();
  const router = useRouter();

  const handleReservarClick = () => {
    localStorage.setItem("pendingReservation", JSON.stringify({
      id,
      selectedConfig,
      selectedOficinaId,
      selectedDepositoId,
      fechaRecogida,
      fechaDeposito,
      precioTotal
    }));
  if (!user) {
    router.push("/auth/signin");
  } else {
    router.push(`/confirmar-reserva?id=${id}`);
  }
};
  useEffect(() => {
    const fetchOficinas = async () => {
      try {
        const res = await fetch(API_OFICINAS);
        const data = await res.json();
        setAllOficinas(data);
      } catch (err) {
        console.error("Error al obtener las oficinas:", err);
      }
    };
    fetchOficinas();
  }, []);

  useEffect(() => {
    const fetchCoches = async () => {
      if (!id) return;
      const [marca, ...modeloParts] = decodeURIComponent(id as string).split("-");
      const modelo = modeloParts.join("-");

      try {
        const res = await fetch(API_CON_EXTRAS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marca, modelo }),
        });

        const data = await res.json();
        setCoches(data);

        const allConfigs: Extras[] = data.map((coche: any) => ({
          techo: coche.techo,
          wifi: coche.wifi,
          gps: coche.gps,
          silla_nino: coche.silla_nino,
          cadenas: coche.cadenas,
        }));

        const unique = allConfigs.filter(
          (config, i, self) =>
            !self.slice(0, i).some((other) => extrasEqual(other, config))
        );

        setUniqueConfigs(unique);
        setSelectedConfig(unique[0] ?? null);
      } catch (err) {
        console.error("Error al obtener los coches:", err);
      }
    };

    fetchCoches();
  }, [id]);

  useEffect(() => {
    const fetchOficinasConfig = async () => {
      if (!selectedConfig || coches.length === 0) return;

      const cocheBase = coches[0];
      const body = {
        marca: cocheBase.marca,
        modelo: cocheBase.modelo,
        ...selectedConfig,
      };

      try {
        const res = await fetch(API_OFICINA_COCHE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        const idsDisponibles = data.oficina;
        const oficinasFiltradas = allOficinas.filter((of: any) =>
          idsDisponibles.includes(of.id)
        );

        setOficinasDisponibles(oficinasFiltradas);
        setSelectedOficinaId(oficinasFiltradas[0]?.id ?? null);
        setSelectedDepositoId(oficinasFiltradas[0]?.id ?? null);
      } catch (err) {
        console.error("Error al obtener oficinas disponibles:", err);
        setOficinasDisponibles([]);
      }
    };

    fetchOficinasConfig();
  }, [selectedConfig, coches, allOficinas]);

  useEffect(() => {
    const geocodeOficina = async () => {
      if (!selectedOficinaId) return;
      const oficina = oficinasDisponibles.find((o) => o.id === selectedOficinaId);
      if (!oficina) return;

      const query = encodeURIComponent(oficina.direccion);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setOficinaCoords([parseFloat(lat), parseFloat(lon)]);
        } else {
          setOficinaCoords(null);
        }
      } catch (err) {
        console.error("Error geocodificando oficina:", err);
        setOficinaCoords(null);
      }
    };

    geocodeOficina();
  }, [selectedOficinaId, oficinasDisponibles]);

  useEffect(() => {
    const calcularPrecio = async () => {
      if (
        !selectedConfig ||
        !fechaRecogida ||
        !fechaDeposito ||
        !selectedOficinaId ||
        coches.length === 0
      ) {
        setPrecioTotal(null);
        return;
      }

      const cocheBase = coches[0];
      const body = {
        marca: cocheBase.marca,
        modelo: cocheBase.modelo,
        ...selectedConfig,
        fecha_inicio: fechaRecogida.toISOString(),
        fecha_fin: fechaDeposito.toISOString(),
        id_oficina_actual: selectedOficinaId,
      };

      try {
        const res = await fetch(API_PRECIO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        setPrecioTotal(data.precio);
      } catch (err) {
        console.error("Error al calcular el precio:", err);
        setPrecioTotal(null);
      }
    };

    calcularPrecio();
  }, [selectedConfig, fechaRecogida, fechaDeposito, selectedOficinaId, coches]);

  if (coches.length === 0) return <p className="text-center mt-20">Coche no encontrado</p>;

  const cocheEjemplo = coches[0];
  const carName = `${cocheEjemplo.marca} ${cocheEjemplo.modelo}`;
  const description = `${cocheEjemplo.categoria} con ${cocheEjemplo.plazas} plazas y transmisión ${cocheEjemplo.marcha}`;
  const oficinaSeleccionada = oficinasDisponibles.find((o) => o.id === selectedOficinaId);
  const puedeReservar =
    selectedConfig &&
    selectedOficinaId &&
    selectedDepositoId &&
    fechaRecogida &&
    fechaDeposito;

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-40 pb-10 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 mb-10">
          <div className="lg:w-1/2">
            <Image
              src="/images/cars/coche.png"
              alt={carName}
              width={600}
              height={400}
              className="rounded-md object-cover w-full"
            />
          </div>

          <div className="lg:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold">{carName}</h1>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Configuración seleccionada:
            </label>
            <div className="space-y-2">
              {uniqueConfigs.map((cfg, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedConfig(cfg)}
                  className={clsx(
                    "w-full text-left px-4 py-2 rounded border",
                    selectedConfig && extrasEqual(cfg, selectedConfig)
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  )}
                >
                  {extrasToString(cfg) || "Sin extras"}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Oficina de recogida:
            </label>
            <select
              value={selectedOficinaId ?? ""}
              onChange={(e) => setSelectedOficinaId(Number(e.target.value))}
              className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
            >
              {oficinasDisponibles.map((oficina) => (
                <option key={oficina.id} value={oficina.id}>
                  {oficina.direccion}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Oficina de depósito:
            </label>
            <select
              value={selectedDepositoId ?? ""}
              onChange={(e) => setSelectedDepositoId(Number(e.target.value))}
              className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
            >
              {allOficinas.map((oficina) => (
                <option key={oficina.id} value={oficina.id}>
                  {oficina.direccion}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Fecha de recogida:
            </label>
            <DatePicker
              selected={fechaRecogida}
              onChange={(date: Date) => setFechaRecogida(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
              Fecha de depósito:
            </label>
            <DatePicker
              selected={fechaDeposito}
              onChange={(date: Date) => setFechaDeposito(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              minDate={fechaRecogida ?? undefined}
              disabled={!fechaRecogida}
              className={clsx(
                "w-full border rounded px-4 py-2",
                !fechaRecogida ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "dark:bg-gray-800 dark:text-white"
              )}
            />

            {/* Cambio aplicado aquí */}
            <p className="text-lg font-semibold mt-4">
              Precio total:{" "}
              <span className="text-primary">
                {precioTotal !== null ? `${precioTotal.toFixed(2)} €` : "calculando..."}
              </span>
            </p>

            <button
              className={clsx(
              "px-6 py-3 rounded-md text-white",
              puedeReservar ? "bg-primary" : "bg-gray-400 cursor-not-allowed"
              )}  
              disabled={!puedeReservar}
             onClick={handleReservarClick}
             > 
              Reservar coche
            </button>

          </div>
        </div>

        <div className="w-full h-[400px] rounded-md overflow-hidden z-0 relative">
          <MapContainer
            center={oficinaCoords ?? fallbackMapCenter}
            zoom={16}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {oficinaCoords && (
              <Marker position={oficinaCoords} icon={carIcon}>
                <Popup>{oficinaSeleccionada?.direccion}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
