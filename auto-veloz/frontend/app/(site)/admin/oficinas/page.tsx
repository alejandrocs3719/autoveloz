"use client";

import { useEffect, useState } from "react";

export default function OficinasPage() {
  const [oficinas, setOficinas] = useState<{ id: number; nombre: string; direccion: string }[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nuevaOficina, setNuevaOficina] = useState({ nombre: "", direccion: "" });
  const [busqueda, setBusqueda] = useState("");

  // ⚡ Obtener oficinas desde el backend
  useEffect(() => {
    fetch("http://13.48.84.201:8000/api/getOficinas")
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", data);
        setOficinas(data);
      })
      .catch((err) => {
        console.error("Error al cargar oficinas:", err);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleAddOficina = () => {
    if (!nuevaOficina.nombre || !nuevaOficina.direccion) {
      setErrorMessage("Por favor, rellene todos los campos.");
      return;
    }
  
    fetch("http://13.48.84.201:8000/api/putOficina", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaOficina),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor.");
        return res.json();
      })
      .then((data) => {
        // Puedes asumir que el backend devuelve la oficina creada, incluyendo su ID
        setOficinas([...oficinas, data]);
        setNuevaOficina({ nombre: "", direccion: "" });
        setShowPopup(false);
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("Error al guardar la oficina:", err);
        setErrorMessage("Hubo un error al guardar la oficina.");
      });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      const nuevasOficinas = [...oficinas];
      for (let line of lines) {
        const [nombre, direccion] = line.split(",");
        if (nombre && direccion) {
          const nuevaId = nuevasOficinas.length + 1;
          nuevasOficinas.push({ id: nuevaId, nombre: nombre.trim(), direccion: direccion.trim() });
        }
      }
      setOficinas(nuevasOficinas);
      setShowPopup(false);
    };
    reader.readAsText(file);
  };

  const oficinasFiltradas = oficinas.filter((oficina) =>
    oficina.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    oficina.direccion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Oficinas Disponibles</h1>

        <input
          type="text"
          placeholder="Buscar por nombre o dirección..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="mb-6 px-4 py-2 w-full rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
        />

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nombre</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {oficinasFiltradas.slice(0, visibleCount).map((oficina) => (
              <tr key={oficina.id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.id}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.nombre}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < oficinasFiltradas.length && (
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
            Añadir Oficina
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Añadir Nueva Oficina</h2>

              <input
                type="text"
                placeholder="Nombre de la oficina"
                value={nuevaOficina.nombre}
                onChange={(e) => setNuevaOficina({ ...nuevaOficina, nombre: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={nuevaOficina.direccion}
                onChange={(e) => setNuevaOficina({ ...nuevaOficina, direccion: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />

              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAddOficina}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                  Guardar
                </button>

                <label className="text-sm text-black dark:text-white">
                  o subir CSV (nombre,dirección):
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
