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
    className: "bg-green-100 text-green-700 border border-green-200",
    color: "#22c55e",
  },

  [ItemUnitStatus.MAINTENANCE]: {
    label: "Mantenimiento",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
    color: "#f59e0b",
  },

  [ItemUnitStatus.OUT_OF_SERVICE]: {
    label: "Fuera de servicio",
    className: "bg-red-100 text-red-700 border border-red-200",
    color: "#ef4444",
  },

  [ItemUnitStatus.RENTED]: {
    label: "Rentado",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    color: "#3b82f6",
  },

  [ItemUnitStatus.IN_TRANSIT]: {
    label: "En tránsito",
    className: "bg-sky-100 text-sky-700 border border-sky-200",
    color: "#0ea5e9",
  },

  [ItemUnitStatus.RESERVED]: {
    label: "Reservado",
    className: "bg-violet-100 text-violet-700 border border-violet-200",
    color: "#8b5cf6",
  },

  [ItemUnitStatus.SOLD]: {
    label: "Vendido",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    color: "#6b7280",
  },

  [ItemUnitStatus.CREATED]: {
    label: "Sin ubicación",
    className: "bg-rose-100 text-rose-600 border border-rose-200",
    color: "#f43f5e",
  },
};
