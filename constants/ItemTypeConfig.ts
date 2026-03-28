import { MdBuild, MdInventory, MdBrandingWatermark, MdWidgets, MdCategory } from "react-icons/md";

import { IconType } from "react-icons";
import { ItemType } from "@/app/types/item/item-type.enum";

export const ITEM_TYPE_LABELS: Record<
  ItemType,
  {
    icon: IconType;
    label: string;
  }
> = {
  [ItemType.TOOL]: {
    icon: MdBuild,
    label: "Equipo",
  },
  [ItemType.PRODUCT]: {
    icon: MdInventory,
    label: "Producto",
  },
  [ItemType.SUPPLY]: {
    icon: MdWidgets,
    label: "Insumo",
  },
};
