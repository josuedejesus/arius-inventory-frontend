import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { LocationViewModel } from "../types/location-view-model";
import { MdLocationOn } from "react-icons/md";

type Props = {
  location: LocationViewModel;
};

export default function MinimalLocationCard({ location }: Props) {
  const typeConfig = LOCATION_TYPE_CONFIG[location.type];
  const Icon = typeConfig?.icon;

  return (
    <div
      key={location.id}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
    >
      <div className="min-w-0">
        {/* 🔷 Nombre + tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-800 truncate">
            {location.name}
          </p>

          {typeConfig && (
            <span className={`text-xs px-2 py-0.5 rounded ${typeConfig.className}`}>
              {Icon && <Icon className="inline mr-1" />}
              {typeConfig.label}
            </span>
          )}
        </div>

        {/* 📍 Dirección */}
        {location.location && (
          <p className="text-xs text-gray-400 truncate flex items-center gap-1">
            <MdLocationOn className="text-blue-400" />
            {location.location}
          </p>
        )}
      </div>

      {/* 🟢 Estado */}
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          location.is_active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {location.is_active ? "Activa" : "Inactiva"}
      </span>
    </div>
  );
}