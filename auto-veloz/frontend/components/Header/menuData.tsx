import { Menu } from "@/types/menu";

export const userMenuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Búsqueda",
    newTab: false,
    path: "/busqueda",
  },
  {
    id: 2.1,
    title: "Nosotros",
    newTab: false,
    path: "/blog",
  },
  {
    id: 4,
    title: "Soporte",
    newTab: false,
    path: "/support",
  },
];

export const adminMenuData: Menu[] = [
  {
    id: 1,
    title: "Estadísticas",
    newTab: false,
    path: "/admin/estadisticas",
  },
  {
    id: 2,
    title: "Mis Oficinas",
    newTab: false,
    path: "/admin/oficinas",
  },
  {
    id: 3,
    title: "Mis Coches",
    newTab: false,
    path: "/admin/coches",
  },
];
