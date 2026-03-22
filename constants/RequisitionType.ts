import {
  MdSyncAlt,
  MdHandshake,
  MdSell,
  MdLocalFireDepartment,
  MdKeyboardReturn,
  MdTune,
  MdMoveToInbox,
  MdSwapHoriz,
  MdBuild,
  MdDoNotDisturb,
} from "react-icons/md";
import { RequisitionType } from "@/app/dashboard/requisitions/types/requisition-type.enum";
import { IconType } from "react-icons";

export const REQUISITION_TYPE_CONFIG: Record<
  RequisitionType,
  {
    label: string;
    description?: string;
    icon: IconType;
  }
> = {
  [RequisitionType.INTERNAL_TRANSFER]: {
    label: "Transferencia Interna",
    description:
      "Movimiento de unidades entre ubicaciones dentro de la organización.",
    icon: MdSyncAlt,
  },
  [RequisitionType.RENT]: {
    label: "Renta",
    description:
      "Solicitud de unidades para uso temporal, generalmente con fecha de devolución.",
    icon: MdHandshake,
  },
  [RequisitionType.SALE]: {
    label: "Venta",
    description: "Solicitud de unidades para venta a clientes externos.",
    icon: MdSell,
  },
  [RequisitionType.CONSUMPTION]: {
    label: "Consumo",
    description: "Solicitud de unidades para consumo interno.",
    icon: MdLocalFireDepartment,
  },
  [RequisitionType.RETURN]: {
    label: "Devolución",
    description: "Devolución de unidades previamente solicitadas.",
    icon: MdKeyboardReturn,
  },
  [RequisitionType.ADJUSTMENT]: {
    label: "Ajuste",
    description: "Ajuste de inventario debido a discrepancias.",
    icon: MdTune,
  },
  [RequisitionType.PURCHASE_RECEIPT]: {
    label: "Recepción de Compra",
    description: "Recepción de unidades adquiridas.",
    icon: MdMoveToInbox,
  },
  [RequisitionType.TRANSFER]: {
    label: "Traslado",
    description: "Transferencia de unidades entre proyectos.",
    icon: MdSwapHoriz,
  },
  [RequisitionType.MAINTENANCE]: {
    label: "Mantenimiento",
    description: "Solicitud de unidades para mantenimiento.",
    icon: MdBuild,
  },
  [RequisitionType.OUT_OF_SERVICE]: {
    label: "Fuera de Servicio",
    description: "Solicitud de unidades fuera de servicio.",
    icon: MdDoNotDisturb,
  },
};
