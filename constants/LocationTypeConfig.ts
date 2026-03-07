import { LocationType } from "@/app/dashboard/locations/types/location-type.enum";
import { IconType } from "react-icons";
import { MdConstruction, MdLocalShipping, MdSyncAlt, MdWarehouse } from "react-icons/md";



export const LOCATION_TYPE_CONFIG: Record<
  LocationType,
  { icon: IconType; className: string; label: string }
> = {
  [LocationType.WAREHOUSE]: {
    icon: MdWarehouse,
    className: "bg-green-50 text-green-600",
    label: "Bodega",
  },
  [LocationType.PROJECT]: {
    icon: MdConstruction,
    className: "bg-blue-50 text-blue-600",
    label: "Proyecto",
  },
  [LocationType.VIRTUAL]: {
    icon: MdSyncAlt,
    className: "bg-amber-50 text-amber-600",
    label: "Virtual",
  },
};