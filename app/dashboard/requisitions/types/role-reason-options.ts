import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { RequisitionType } from "./requisition-type.enum";
import { UserRole } from "../../persons/types/user-role.enum";

export const ROLE_REASON_OPTIONS: Record<
  string,
  {
    movement: string;
    reason: RequisitionType;
    label: string;
    description: string;
  }[]
> = {
  ADMIN: [
    {
      movement: "IN",
      reason: RequisitionType.PURCHASE_RECEIPT,
      label: REQUISITION_TYPE_CONFIG[RequisitionType.PURCHASE_RECEIPT].label,
      description: "Registrar mercancía recibida de un proveedor",
    },
    {
      movement: "IN",
      reason: RequisitionType.RETURN,
      label: "Devolución",
      description: "Reingreso de equipo devuelto desde un proyecto",
    },
    {
      movement: "IN",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste positivo (+)",
      description: "Corrección por sobrante o error de conteo",
    },
    {
      movement: "IN",
      reason: RequisitionType.MAINTENANCE,
      label: "Regreso de mantenimiento",
      description: "Equipo reparado que vuelve a estar disponible",
    },
    {
      movement: "OUT",
      reason: RequisitionType.SALE,
      label: "Venta",
      description: "Salida definitiva de equipo vendido a un cliente",
    },
    {
      movement: "OUT",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste negativo (−)",
      description: "Corrección por faltante, pérdida o error de conteo",
    },
    {
      movement: "OUT",
      reason: RequisitionType.MAINTENANCE,
      label: "Envío a mantenimiento",
      description: "Equipo que sale temporalmente para ser reparado",
    },
    {
      movement: "OUT",
      reason: RequisitionType.OUT_OF_SERVICE,
      label: "Dar de baja",
      description: "Equipo retirado definitivamente del inventario",
    },
    {
      movement: "OUT",
      reason: RequisitionType.RENT,
      label: "Renta",
      description: "Salida temporal de equipo rentado a un proyecto",
    },
    {
      movement: "OUT",
      reason: RequisitionType.CONSUMPTION,
      label: "Envío de material a proyecto",
      description: "Material consumible despachado a un proyecto",
    },
    {
      movement: "INT",
      reason: RequisitionType.INTERNAL_TRANSFER,
      label: "Transferencia interna",
      description: "Movimiento de equipo entre bodegas",
    },
    {
      movement: "EXT",
      reason: RequisitionType.TRANSFER,
      label: "Transferencia externa",
      description: "Movimiento de equipo entre proyectos",
    },
  ],

  WAREHOUSE_MANAGER: [
    {
      movement: "IN",
      reason: RequisitionType.PURCHASE_RECEIPT,
      label: "Recepción de compra",
      description: "Registrar mercancía recibida de un proveedor",
    },
    {
      movement: "IN",
      reason: RequisitionType.RETURN,
      label: "Devolución",
      description: "Reingreso de equipo devuelto desde un proyecto",
    },
    {
      movement: "IN",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste positivo (+)",
      description: "Corrección por sobrante o error de conteo",
    },
    {
      movement: "OUT",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste negativo (−)",
      description: "Corrección por faltante, pérdida o error de conteo",
    },
    {
      movement: "INT",
      reason: RequisitionType.TRANSFER,
      label: "Traslado",
      description: "Movimiento de equipo entre bodegas o proyectos",
    },
  ],

  ADMINISTRATIVE_MANAGER: [
    {
      movement: "IN",
      reason: RequisitionType.PURCHASE_RECEIPT,
      label: "Recepción de compra",
      description: "Registrar mercancía recibida de un proveedor",
    },
    {
      movement: "IN",
      reason: RequisitionType.RETURN,
      label: "Devolución",
      description: "Reingreso de equipo devuelto desde un proyecto",
    },
    {
      movement: "IN",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste positivo (+)",
      description: "Corrección por sobrante o error de conteo",
    },
    {
      movement: "OUT",
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste negativo (−)",
      description: "Corrección por faltante, pérdida o error de conteo",
    },
    {
      movement: "INT",
      reason: RequisitionType.TRANSFER,
      label: "Traslado",
      description: "Movimiento de equipo entre bodegas o proyectos",
    },
  ],
};
