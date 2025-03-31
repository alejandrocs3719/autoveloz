"use client";

import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
          {/* Texto de introducción */}
          <div className="md:w-1/2">
            <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero">
              Alquila coches con 
              <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark">
                AutoVeloz
              </span>
            </h1>
            <p>
              Con más de 50 oficinas en todo el país, encuentra el coche perfecto para tu viaje.  
              Consulta nuestras ubicaciones en el mapa y reserva fácilmente en segundos.
            </p>

            {/* Botón de acción */}
            <div className="mt-5">
              <button className="rounded-full bg-black px-7.5 py-2.5 text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho">
                Encuentra tu sucursal más cercana aquí
              </button>
            </div>
          </div>

          {/* Imagen del mapa */}
          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 1xl:-mr-5.5">
              <img
                src="/images/hero/mapa_esp.webp" // Cambia por la ruta correcta del archivo
                alt="Mapa de oficinas AutoVeloz"
                className="shadow-solid-l w-96 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    </>
  );
};

export default Hero;
