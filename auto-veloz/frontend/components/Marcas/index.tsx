"use client";

import React from "react";
import datoMarca from "./datoMarcas";
import Link from "next/link";
import Image from "next/image";

import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";

const Marcas = () => {

  return (
    <section id="car-brands" className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0 text-center">
          <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero">
            Encuentra una selección de nuestros coches favoritos
          </h1>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10 items-center">
            {datoMarca.map((brand, index) => (
              
              <div key={index} className="flex flex-col items-center">
                {/* Contenedor para alternar entre imagen clara y oscura */}
                
                <Link key={brand.name} href={`/busqueda?marca=${brand.name}`}>
                <div>
                  {/* Imagen modo claro */}
                  <img
                    src={brand.icon}
                    alt={brand.name}
                    className="dark:hidden h-16 w-auto"
                  />
                  {/* Imagen modo oscuro */}
                  <img
                    src={brand.darkIcon}
                    alt={brand.name}
                    className="hidden dark:block h-16 w-auto"
                  />
                </div>

                {/* Texto con color adaptado al modo oscuro */}
                <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
                  {brand.name}
                </p>
                </Link>
              </div>
            ))}
          </div>


        <div className="mt-10">
          <Link href={`/busqueda`}>
          <button className="text-orange-500 font-semibold hover:underline">
            Ver todos los coches disponibles &gt;
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Marcas;
