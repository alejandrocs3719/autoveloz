"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthContext";
import clsx from "clsx";
import Image from "next/image";

const ConfirmarReserva = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [formData, setFormData] = useState({ tarjeta_credito: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{ success: boolean; message: string } | null>(null);
  const [reserva, setReserva] = useState<any>(null);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const pending = localStorage.getItem("pendingReservation");

    if (!user && !pending) {
      router.push("/");
      return;
    }

    if (pending) {
      const parsed = JSON.parse(pending);
      setReserva(parsed);
      localStorage.removeItem("pendingReservation");
    }
  }, [user, isAuthReady]);

  const handleSubmit = async () => {
    if (!reserva || !user) return;

    const [marca, ...modeloParts] = decodeURIComponent(reserva.id).split("-");
    const modelo = modeloParts.join("-");

    const payload = {
      marca,
      modelo,
      ...reserva.selectedConfig,
      correo: user.correo,
      id_oficina_origen: reserva.selectedOficinaId,
      id_oficina_destino: reserva.selectedDepositoId,
      fecha_inicio: new Date(reserva.fechaRecogida).toISOString(),
      fecha_fin: new Date(reserva.fechaDeposito).toISOString(),
      tarjeta_credito: formData.tarjeta_credito,
      precio_total: reserva.precioTotal ?? 0,
    };

    setLoading(true);
    try {
      const res = await fetch("http://13.48.84.201:8000/api/crearReserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPopup({ success: true, message: "Reserva realizada con éxito." });
      } else {
        setPopup({ success: false, message: "Error al crear la reserva." });
      }
    } catch (err) {
      setPopup({ success: false, message: "Error inesperado." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthReady || (user && !reserva)) {
    return (
      <div className="pt-32 text-center">
        <p className="text-lg text-gray-600">Cargando datos de la reserva...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Confirmar Reserva</h1>

      {user && reserva && (
        <div className="space-y-4">
          <Image
            src="/images/cars/coche.png"
            alt="Coche reservado"
            width={500}
            height={300}
            className="rounded-xl mx-auto"
          />

          <div className="space-y-2">
            <p><strong>Usuario:</strong> {user.nombre} ({user.correo})</p>

            <p>
              <strong>Vehículo:</strong> {decodeURIComponent(reserva.id).replace("-", " ")}
            </p>

            <p><strong>Extras seleccionados:</strong></p>
            <ul className="list-disc list-inside ml-4">
              {Object.entries(reserva.selectedConfig).map(([key, value]) =>
                value ? <li key={key}>{key.replace(/_/g, " ")}</li> : null
              )}
            </ul>

            <p>
              <strong>Fechas:</strong><br />
              Recogida: {formatDate(reserva.fechaRecogida)}<br />
              Depósito: {formatDate(reserva.fechaDeposito)}
            </p>

            <p><strong>Precio total:</strong> {reserva.precioTotal ?? 0} €</p>
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Tarjeta de crédito"
        value={formData.tarjeta_credito}
        onChange={(e) => setFormData({ ...formData, tarjeta_credito: e.target.value })}
        className="w-full px-4 py-2 border rounded"
      />

      <button
        disabled={loading || !formData.tarjeta_credito}
        onClick={handleSubmit}
        className={clsx(
          "px-4 py-2 rounded text-white",
          formData.tarjeta_credito ? "bg-primary" : "bg-gray-400"
        )}
      >
        {loading ? "Confirmando..." : "Confirmar reserva"}
      </button>

      {popup && (
        <div className="mt-6 p-4 border rounded shadow-md bg-white">
          <p className={popup.success ? "text-green-600" : "text-red-600"}>
            {popup.message}
          </p>
          <button
            className="mt-2 text-blue-600 underline"
            onClick={() => {
              if (popup.success) {
                router.push("/");
              } else {
                setPopup(null);
              }
            }}
          >
            {popup.success ? "Volver a inicio" : "Revisar datos"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmarReserva;
