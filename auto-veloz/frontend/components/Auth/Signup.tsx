"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Signup = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    tipoUsuario: "cliente",
  });
  // Fecha de nacimiento predeterminada a hoy
  const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre: `${data.firstName} ${data.lastName}`,
      dni: data.dni,
      fecha_nacimiento: fechaNacimiento.toISOString(),
      correo: data.email,
      tipo_usuario: data.tipoUsuario,
      contrasena: data.password,
    };

    try {
      const res = await fetch("http://13.48.84.201:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error en el registro");
      }
      
      localStorage.setItem("isLoggedIn", "true");
      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* ===== Formulario de Registro Inicio ===== */}
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
        <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
          >
            <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
              Crea una Cuenta
            </h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              {/* Nombre y Apellido */}
              <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                <input
                  name="firstName"
                  type="text"
                  placeholder="Nombre"
                  value={data.firstName}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark lg:w-1/2"
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Apellido"
                  value={data.lastName}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark lg:w-1/2"
                />
              </div>

              {/* DNI y Fecha de Nacimiento */}
              <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                <input
                  name="dni"
                  type="text"
                  placeholder="DNI"
                  value={data.dni}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark lg:w-1/2"
                />
                <div className="w-full lg:w-1/2">
                  <DatePicker
                    selected={fechaNacimiento}
                    onChange={(date: Date) => setFechaNacimiento(date)}
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <input
                        type="text"
                        className="w-full mb-4 px-4 py-2 rounded-md border border-stroke dark:border-strokedark dark:bg-black dark:text-white"
                        placeholder="Selecciona tu fecha de nacimiento"
                      />
                    }
                  />
                </div>
              </div>

              {/* Correo y Contraseña */}
              <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                <input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark lg:w-1/2"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus-visible:outline-none dark:border-strokedark lg:w-1/2"
                />
              </div>

              {/* Tipo de Usuario (oculto) */}
              <input
                name="tipoUsuario"
                type="hidden"
                value={data.tipoUsuario}
              />

              {/* Botón Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                >
                  Crear Cuenta
                </button>
              </div>
            </form>

            {/* Google y GitHub sin cambios */}
            <div className="flex items-center gap-8 mt-8">
              {/* Botones originales de Google y GitHub aquí... */}
            </div>

          </motion.div>
        </div>
      </section>
      {/* ===== Formulario de Registro Fin ===== */}
    </>
  );
};

export default Signup;
