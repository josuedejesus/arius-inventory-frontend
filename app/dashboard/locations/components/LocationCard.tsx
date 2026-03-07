import { LOCATION_TYPE_LABELS } from "@/constants/LocationTypes";
import { formatDate } from "../../../utils/formatters";

type Location = {
  id: number;
  name: string;
  type: string;
  location: string;
  is_active: boolean;
  updated_at: string;
};

type LocationCardProps = {
    location: Location,
    onClick: (location: Location) => void
}

export default function LocationCard({ location, onClick }: LocationCardProps) {
  return (
    <div
      onClick={() => onClick(location)}
      className="bg-white cursor-pointer
             px-4 py-2 grid
             grid-cols-[3fr_2fr_4fr_2fr]
             items-center gap-4
             hover:bg-gray-50 text-sm"
    >
      {/* Nombre */}
      <p className="text-gray-800 truncate">{location.name}</p>

      {/* Type */}
      <p className="text-gray-600 truncate">{LOCATION_TYPE_LABELS[location.type] ?? location.type}</p>

      {/* Ubicacion */}
      <p className="text-gray-600 truncate">{location.location}</p>
      

      {/* Estado */}
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            location.is_active ? "text-green-600" : "text-red-500"
          }`}
        >
          {location.is_active ? "Activo" : "Inactivo"}
        </p>
      </div>
    </div>
  );
}
