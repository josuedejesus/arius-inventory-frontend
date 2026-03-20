import { LocationType } from "@/app/dashboard/locations/types/location-type.enum";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { MdInventory, MdLocationOn, MdPeople } from "react-icons/md";

type LocationStat = {
  id: number;
  name: string;
  type: LocationType;
  total_units: number;
};

type LocationStatcardProps = {
  stat: LocationStat;
  onClick: (stat: any) => void;
};
export default function LocationStatcard({
  stat,
  onClick,
}: LocationStatcardProps) {
  const typeConfig = LOCATION_TYPE_CONFIG[stat?.type];
  const Icon = typeConfig?.icon;
  return (
    <button
      onClick={() => onClick(stat)}
      key={stat?.id}
      className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
  text-gray-600 bg-gray-100 hover:bg-gray-50 hover:text-gray-900
  transition-all duration-150 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{stat?.name}</span>

        <span
          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded uppercase font-medium ${typeConfig?.className}`}
        >
          {Icon && <Icon className="text-xs" />}
          {typeConfig?.label}
        </span>
      </div>

      {/* 🔷 DERECHA */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500 whitespace-nowrap">
          <MdPeople className="text-blue-500 text-base" />
          <span className="font-medium text-gray-700">0</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 whitespace-nowrap">
          <MdInventory className="text-emerald-500 text-base" />
          <span className="font-medium text-gray-700">{stat.total_units}</span>
        </div>
      </div>
    </button>
  );
}
