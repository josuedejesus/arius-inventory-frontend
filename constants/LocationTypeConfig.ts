import { LocationType } from "@/app/dashboard/locations/types/location-type.enum";
import { IconType } from "react-icons";
import {
  MdBuild,
  MdCloud,
  MdConstruction,
  MdLocalShipping,
  MdSyncAlt,
  MdWarehouse,
} from "react-icons/md";

export const LOCATION_TYPE_CONFIG: Record<
  LocationType,
  { icon: IconType; className: string; label: string }
> = {
  [LocationType.WAREHOUSE]: {
    icon: MdWarehouse, // ✓ perfecto, quédate con este
    className: "bg-green-500",
    label: "Bodega",
  },
  [LocationType.PROJECT]: {
    icon: MdConstruction, // ✓ perfecto, quédate con este
    className: "bg-blue-500",
    label: "Proyecto",
  },
  [LocationType.MAINTENANCE]: {
    icon: MdBuild, // llave/herramienta — más directo que un camión
    className: "bg-purple-500",
    label: "Mantenimiento",
  },
  [LocationType.VIRTUAL]: {
    icon: MdCloud, // intangible/lógico — o MdInventory2 si es contable
    className: "bg-amber-500",
    label: "Virtual",
  },
};
