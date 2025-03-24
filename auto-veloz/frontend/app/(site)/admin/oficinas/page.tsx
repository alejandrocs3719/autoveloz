// app/admin/oficinas/page.tsx
"use client";

import { useEffect, useState } from "react";

// Datos simulados en frontend
let oficinasData = [
  { id: 1, nombre: "Oficina Central", direccion: "Calle Mayor 1, Madrid" },
  { id: 2, nombre: "Sucursal Norte", direccion: "Avenida del Norte 23, Bilbao" },
  { id: 3, nombre: "Oficina Este", direccion: "Calle del Mar 45, Valencia" },
  { id: 4, nombre: "Delegación Sur", direccion: "Calle Sol 99, Sevilla" },
  { id: 5, nombre: "Centro Logístico", direccion: "Polígono Sur, Zaragoza" },
];

export default function OficinasPage() {
  const [oficinas, setOficinas] = useState(oficinasData.slice(0, 3));
  const [visibleCount, setVisibleCount] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [nuevaOficina, setNuevaOficina] = useState({ nombre: "", direccion: "" });

  const handleLoadMore = () => {
    const next = oficinasData.slice(0, visibleCount + 3);
    setOficinas(next);
    setVisibleCount(prev => prev + 3);
  };

  const handleAddOficina = () => {
    const nuevaId = oficinasData.length + 1;
    const nueva = { id: nuevaId, ...nuevaOficina };
    oficinasData.push(nueva);
    setOficinas(oficinasData.slice(0, visibleCount + 1));
    setNuevaOficina({ nombre: "", direccion: "" });
    setShowPopup(false);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(Boolean);
      for (let line of lines) {
        const [nombre, direccion] = line.split(",");
        if (nombre && direccion) {
          const nuevaId = oficinasData.length + 1;
          const nueva = { id: nuevaId, nombre: nombre.trim(), direccion: direccion.trim() };
          oficinasData.push(nueva);
        }
      }
      setOficinas(oficinasData.slice(0, visibleCount + 3));
      setShowPopup(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Oficinas Disponibles</h1>

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nombre</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {oficinas.map((oficina) => (
              <tr key={oficina.id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.id}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.nombre}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{oficina.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < oficinasData.length && (
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