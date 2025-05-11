"use client"
import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  fecha_nacimiento: string;
  correo: string;
  tipo_usuario: string;
  contrasena: string;
}

export default function AdminUsersPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState<Partial<Cliente>>({
    nombre: "",
    dni: "",
    fecha_nacimiento: "",
    correo: "",
    tipo_usuario: "cliente",
    contrasena: ""
  });
  const [busqueda, setBusqueda] = useState("");

  // Obtener clientes desde el backend
  useEffect(() => {
    fetch("http://13.48.84.201:8000/api/getClientes")
      .then(res => res.json())
      .then(data => {
        console.log("Clientes recibidos:", data);
        setClientes(data);
      })
      .catch(err => {
        console.error("Error al cargar clientes:", err);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleAddCliente = () => {
    const { nombre, dni, fecha_nacimiento, correo, tipo_usuario, contrasena } = nuevoCliente;
    if (!nombre || !dni || !fecha_nacimiento || !correo || !tipo_usuario || !contrasena) {
      setErrorMessage("Por favor, rellene todos los campos.");
      return;
    }

    fetch("http://13.48.84.201:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor.");
        return res.json();
      })
      .then((clienteCreado: Cliente) => {
        setClientes([...clientes, clienteCreado]);
        setNuevoCliente({ nombre: "", dni: "", fecha_nacimiento: "", correo: "", tipo_usuario: "cliente", contrasena: "" });
        setShowPopup(false);
        setErrorMessage("");
      })
      .catch(err => {
        console.error("Error al guardar el cliente:", err);
        setErrorMessage("Hubo un error al guardar el cliente.");
      });
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-blacksection px-4 pt-32 pb-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Clientes Registrados</h1>

        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="mb-6 px-4 py-2 w-full rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
        />

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Nombre</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">DNI</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Fecha de Nac.</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Correo</th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Tipo Usuario</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.slice(0, visibleCount).map(cliente => (
              <tr key={cliente.id}>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.id}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.nombre}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.dni}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.fecha_nacimiento}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.correo}</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{cliente.tipo_usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleCount < clientesFiltrados.length && (
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
            Añadir Cliente
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Añadir Nuevo Cliente</h2>

              <input
                type="text"
                placeholder="Nombre"
                value={nuevoCliente.nombre || ""}
                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <input
                type="text"
                placeholder="DNI"
                value={nuevoCliente.dni || ""}
                onChange={e => setNuevoCliente({ ...nuevoCliente, dni: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={nuevoCliente.fecha_nacimiento || ""}
                onChange={e => setNuevoCliente({ ...nuevoCliente, fecha_nacimiento: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <input
                type="email"
                placeholder="Correo"
                value={nuevoCliente.correo || ""}
                onChange={e => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />
              <select
                value={nuevoCliente.tipo_usuario || "cliente"}
                onChange={e => setNuevoCliente({ ...nuevoCliente, tipo_usuario: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
                <option value="empresa">Empresa</option>
              </select>
              <input
                type="password"
                placeholder="Contraseña"
                value={nuevoCliente.contrasena || ""}
                onChange={e => setNuevoCliente({ ...nuevoCliente, contrasena: e.target.value })}
                className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
              />

              {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAddCliente}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                  Guardar Cliente
                </button>
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
