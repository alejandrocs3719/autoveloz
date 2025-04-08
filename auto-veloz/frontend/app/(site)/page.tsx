import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Marcas from "@/components/Marcas";
import DescripcionProceso from "@/components/FeaturesTab";
import GaleriaCoches from "@/components/Galeria";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";

export const metadata: Metadata = {
  title: "Autoveloz",

  // other metadata
  description: "Explora y reserva coches de forma rápida y sencilla"
};

export default function Home() {
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
