import { LOCATION_TYPE_LABELS } from "@/constants/LocationTypes";
import { formatDate } from "../../utils/formatters";
import { MdPlace } from "react-icons/md";
import { PrimaryBadge } from "../PrimaryBadge";

type Location = {
  id: number;
  name: string;
  type: string;
  location: string;
  is_active: boolean;
  updated_at: string;

  total_stock?: number;
  total_items?: number;
  last_movement_at?: string;
};

type LocationCardProps = {
  location: any;
  onClick: (location: Location) => void;
};

export default function InventoryLocationCard({
  location,
  onClick,
}: LocationCardProps) {
  const stock = location.total_stock ?? 0;
  const items = location.total_items ?? 0;

  const stockColor =
    stock < 0
      ? "text-red-600"
      : stock === 0
        ? "text-gray-400"
        : "text-gray-900";

  return (
    <div
      onClick={() => onClick(location)}
      className="bg-white cursor-pointer rounded-xl shadow-sm
                 p-4 flex flex-col gap-3
                 hover:shadow-md hover:bg-gray-50
                 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {location.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {LOCATION_TYPE_LABELS[location.type] ?? location.type}
          </p>
        </div>

        <PrimaryBadge label={location?.is_active ? 'Activo' : 'Inactivo'} variant={location?.is_active ? "success" : "warning"}/>

        
      </div>

      {/* Ubicación */}
      <p className="flex items-center text-sm text-gray-600 truncate">
        <MdPlace color="orange" /> {location.location}
      </p>

      {/* Inventario */}
      <div className="flex justify-between items-end pt-2 border-t">
        <div>
          <p className={`text-2xl font-semibold ${stockColor}`}>{stock}</p>
          <p className="text-xs text-gray-500">Stock total</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 text-right">
        Actualizado {formatDate(location.updated_at)}
      </div>
    </div>
  );
}
