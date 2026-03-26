import {
  MdMoveToInbox,
  MdOutbox,
  MdSwapHoriz,
} from "react-icons/md";
import { MovementType } from "@/app/dashboard/requisitions/types/movement-type";
import { IconType } from "react-icons";

export const MOVEMENT_TYPE_CONFIG: Record<
  MovementType,
  {
    label: string;
    description?: string;
    icon: IconType;
  }
> = {
  [MovementType.IN]: {
    label: "Entrada",
    description: "Ingreso de unidades al inventario de la organización.",
    icon: MdMoveToInbox,
  },
  [MovementType.OUT]: {
    label: "Salida",
    description: "Egreso de unidades del inventario de la organización.",
    icon: MdOutbox,
  },
  [MovementType.INT]: {
    label: "Interno",
    description: "Movimiento de unidades entre ubicaciones dentro de la organización.",
    icon: MdSwapHoriz,
  },
};