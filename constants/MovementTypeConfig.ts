import { MdMoveToInbox, MdOutbox, MdSwapHoriz } from "react-icons/md";
import { MovementType } from "@/app/dashboard/requisitions/types/movement-type";
import { IconType } from "react-icons";
import { variant } from "./VariantEnum";

export const MOVEMENT_TYPE_CONFIG: Record<
  MovementType,
  {
    label: string;
    description?: string;
    icon: IconType;
    variant?: variant;
  }
> = {
  [MovementType.IN]: {
    label: "Entrada",
    description: "Ingreso de unidades al inventario de la organización.",
    icon: MdMoveToInbox,
    variant: variant.success,
  },
  [MovementType.OUT]: {
    label: "Salida",
    description: "Egreso de unidades del inventario de la organización.",
    icon: MdOutbox,
    variant: variant.danger,
  },
  [MovementType.INT]: {
    label: "Interno",
    description:
      "Movimiento de unidades entre ubicaciones dentro de la organización.",
    icon: MdSwapHoriz,
    variant: variant.warning,
  },
  [MovementType.EXT]: {
    label: "Externo",
    description:
      "Movimiento de unidades hacia o desde una ubicación externa a la organización.",
    icon: MdSwapHoriz,
    variant: variant.info,
  },
};
