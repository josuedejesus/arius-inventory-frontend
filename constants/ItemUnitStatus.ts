import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";

export const ITEM_UNIT_STATUS_CONFIG: Record<
  ItemUnitStatus,
  {
    label: string;
    className: string;
    color: string;
  }
> = {
  [ItemUnitStatus.AVAILABLE]: {
    label: "Disponible",
    className: "bg-green-500",
    color: "#22c55e",
  },

  [ItemUnitStatus.MAINTENANCE]: {
    label: "Mantenimiento",
    className: "bg-amber-500",
    color: "#f59e0b",
  },

  [ItemUnitStatus.OUT_OF_SERVICE]: {
    label: "Fuera de servicio",
    className: "bg-red-500",
    color: "#ef4444",
  },

  [ItemUnitStatus.RENTED]: {
    label: "Rentado",
    className: "bg-blue-500",
    color: "#3b82f6",
  },

  [ItemUnitStatus.IN_TRANSIT]: {
    label: "En tránsito",
    className: "bg-sky-500",
    color: "#0ea5e9",
  },

  [ItemUnitStatus.RESERVED]: {
    label: "Reservado",
    className: "bg-violet-500",
    color: "#8b5cf6",
  },

  [ItemUnitStatus.SOLD]: {
    label: "Vendido",
    className: "bg-gray-500",
    color: "#6b7280",
  },

  [ItemUnitStatus.CREATED]: {
    label: "Sin ubicación",
    className: "bg-rose-500",
    color: "#f43f5e",
  },
};
