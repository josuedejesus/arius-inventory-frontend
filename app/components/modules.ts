import { Module } from "./cards/ModuleCard";

export const modules: Module[] = [
  {
    id: "persons",
    title: "Personas",
    description:
      "Creación, edición de personas.",
    href: "/dashboard/persons",
  },
  {
    id: "users",
    title: "Usuarios",
    description:
      "Creación, edición y control de accesos de usuarios.",
    href: "/dashboard/users",
  },
  {
    id: "locations",
    title: "Ubicaciones",
    description:
      "Creación, edición de ubicaciones.",
    href: "/dashboard/locations",
  },
  {
    id: "items",
    title: "Articulos",
    description:
      "Creación, edición de articulos.",
    href: "/dashboard/items",
  },
  {
    id: "requisitions",
    title: "Requisiciones",
    description:
      "Creación, edición de requisiciones.",
    href: "/dashboard/requisitions",
  },
  {
    id: "inventory",
    title: "Inventario",
    description:
      "Gestión y control de inventarios, existencias y movimientos de productos.",
    href: "/dashboard/inventory",
  },
];
