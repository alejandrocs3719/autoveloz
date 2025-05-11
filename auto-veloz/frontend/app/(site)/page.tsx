"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthContext";

import Hero from "@/components/Hero";
import Marcas from "@/components/Marcas";
import DescripcionProceso from "@/components/FeaturesTab";
import GaleriaCoches from "@/components/Galeria";
import CTA from "@/components/CTA";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const pending = localStorage.getItem("pendingReservation");
    if (user && pending) {
      router.push("/confirmar-reserva");
    }
  }, [user]);

  return (
    <main>
      <Hero />
      <Marcas />
      <DescripcionProceso />
      <GaleriaCoches />
      <CTA />
    </main>
  );
}

