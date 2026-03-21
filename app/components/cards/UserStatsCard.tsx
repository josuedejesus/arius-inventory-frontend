import { LocationType } from "@/app/dashboard/locations/types/location-type.enum";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { PERSON_ROLE_LABELS } from "@/constants/PersonRoles";
import { MdInventory, MdLocationOn } from "react-icons/md";



type UserStat = {
  id: number;
  person_name: string;
  total_locations: number;
  total_units: number;
};

type Props = {
  stat: UserStat;
  onClick: (stat: any) => void;
};
export default function UserStatcard({
  stat,
  onClick,
}: Props) {

  return (
    <button
  onClick={() => onClick(stat)}
  key={stat?.id}
  className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
  text-gray-600 bg-gray-100 hover:bg-gray-50 hover:text-gray-900
  transition-all duration-150 cursor-pointer"
>
  {/* 🔷 IZQUIERDA */}
  <div className="flex items-center gap-2 min-w-0">
    <span className="font-medium truncate">
      {stat?.person_name}
    </span>
  </div>

  {/* 🔷 DERECHA */}
  <div className="flex items-center gap-6 flex-shrink-0">
    <div className="flex items-center gap-1.5 text-gray-500 whitespace-nowrap">
      <MdLocationOn className="text-blue-500 text-base" />
      <span className="font-medium text-gray-700">
        {stat.total_locations}
      </span>
    </div>

    <div className="flex items-center gap-1.5 text-gray-500 whitespace-nowrap">
      <MdInventory className="text-emerald-500 text-base" />
      <span className="font-medium text-gray-700">
        {stat.total_units}
      </span>
    </div>
  </div>
</button>
  );
}
