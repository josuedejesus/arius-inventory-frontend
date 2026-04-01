import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { RequisitionType } from "./requisition-type.enum";
import { UserRole } from "../../persons/types/user-role.enum";
import { MovementType } from "./movement-type";

export const MOVEMENT_REASON_OPTIONS: Record<
  MovementType,
  {
    reason: RequisitionType;
    label: string;
    description: string;
  }[]
> = {
  [MovementType.IN]: [
    {
      reason: RequisitionType.PURCHASE_RECEIPT,
      label: "Recepción de compra",
      description: "Registrar mercancía recibida de un proveedor",
    },
    {
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste positivo (+)",
      description: "Corrección por sobrante o error de conteo",
    },
    {
      reason: RequisitionType.RETURN,
      label: "Devolución",
      description: "Reingreso de equipo devuelto desde un proyecto",
    },
    {
      reason: RequisitionType.MAINTENANCE,
      label: "Regreso de mantenimiento",
      description: "Equipo reparado que vuelve a estar disponible",
    },
  ],

  [MovementType.OUT]: [
    {
      reason: RequisitionType.ADJUSTMENT,
      label: "Ajuste negativo (−)",
      description: "Corrección por faltante, pérdida o error de conteo",
    },
    
    {
      reason: RequisitionType.RENT,
      label: "Renta",
      description: "Salida temporal de equipo rentado a un proyecto",
    },
    {
      reason: RequisitionType.CONSUMPTION,
      label: "Consumo",
      description: "Material consumible despachado a un proyecto",
    },
    {
      reason: RequisitionType.MAINTENANCE,
      label: "Envío a mantenimiento",
      description: "Equipo que sale temporalmente para ser reparado",
    },
    {
      reason: RequisitionType.OUT_OF_SERVICE,
      label: "Fuera de servicio",
      description: "Equipo retirado definitivamente del inventario",
    },
    /*{
      reason: RequisitionType.TRANSFER,
      label: "Traslado",
      description: "Movimiento entre proyectos o bodegas",
    },*/

    {
      reason: RequisitionType.SALE,
      label: "Venta",
      description: "Salida definitiva de equipo vendido a un cliente",
    },
  ],

  [MovementType.INT]: [
    {
      reason: RequisitionType.INTERNAL_TRANSFER,
      label: "Transferencia interna",
      description: "Movimiento de equipo entre bodegas",
    },
  ],
  [MovementType.EXT]: [
    {
      reason: RequisitionType.TRANSFER,
      label: "Traslado",
      description: "Movimiento de equipo entre bodegas o proyectos",
    },
  ],
};
