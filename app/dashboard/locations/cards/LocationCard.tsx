import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { LocationViewModel } from "../types/location-view-model";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { MdLocationOn } from "react-icons/md";

type Props = {
  location: LocationViewModel;
};

export default function LocationCard({ location }: Props) {
  return (
    <div className="bg-white rounded-2xl border p-6 flex justify-between items-center">
      <div className="space-y-1">
        {/* 🔷 Nombre + tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-lg font-semibold text-gray-800">
            {location?.name}
          </h1>

          {location?.type &&
            (() => {
              const typeConfig = LOCATION_TYPE_CONFIG[location.type];
              const Icon = typeConfig?.icon;

              return (
                <PrimaryBadge
                  icon={Icon ? <Icon /> : null}
                  label={typeConfig?.label || ""}
                  className={typeConfig?.className || "default"}
                />
              );
            })()}
        </div>
        {location?.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MdLocationOn className="text-blue-400" />{" "}
            {location?.location || "Sin ubicación"}
          </p>
        )}
      </div>
    </div>
  );
}
