import { useState } from "react";
import { ItemViewModel } from "@/app/dashboard/items/types/item-view.model";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";
import { MdLocationOff, MdLocationOn, MdNoPhotography } from "react-icons/md";
import { PrimaryBadge } from "../badges/PrimaryBadge";

type itemCardProps = {
  item?: any;
  onClick: (item: any) => void;
};

export default function itemCard({ item, onClick }: itemCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(item)}
      className="group w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left"
    >
      {/* Image */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {!error && item?.image_path ? (
          <img
            src={`${apiUrl}/uploads/${item.image_path}`}
            onError={() => setError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <MdNoPhotography className="text-3xl" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: code + type */}
        <div className="flex items-center gap-2">
          <PrimaryBadge label={String(item?.id) ?? "N/A"} />
        </div>

        {/* Row 2: name */}
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {item?.name}
        </p>

        {/* Row 3: brand · model */}
        {(item?.brand || item?.model) && (
          <p className="text-xs text-gray-500 truncate">
            {[item?.brand, item?.model].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Row 4: location */}
        <div className="flex items-center gap-1.5 mt-1">
          {!item?.location_id ? (
            <span className="flex items-center text-red-400 gap-1">
              <MdLocationOff className="text-xs" />
              <p className="text-xs">Sin ubicación</p>
            </span>
          ) : (
            <span className="flex items-center text-blue-400 gap-1">
              <MdLocationOn className="text-xs" />
              <p className="text-xs">{item?.location_name}</p>
            </span>
          )}

        </div>

        {/*Row 5: available quantity*/}
        {item?.available_quantity !== undefined && (
          <p className="text-xs text-gray-400 mt-0.5">
            Cantidad disponible:{" "}
            <span className="font-semibold text-gray-600">
              {item.available_quantity} {item.unit_code}
            </span>
          </p>
        )}
        
      </div>
    </button>
  );
}
