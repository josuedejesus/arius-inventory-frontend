import { ITEM_CONDITION_CONFIG } from "@/constants/ItemCondition";
import { useState } from "react";
import { MdLocationOff, MdLocationOn, MdNoPhotography } from "react-icons/md";
import { PrimaryBadge } from "../../../components/badges/PrimaryBadge";
import { ITEM_UNIT_STATUS_CONFIG } from "@/constants/ItemUnitStatus";
import { ItemUnitViewModel } from "@/app/types/item/item-unit-view.model";

type ItemUnitCardProps = {
  itemUnit: ItemUnitViewModel;
  item?: any;
  onClick?: (item: any) => void;
  disabled?: boolean;
};

export default function ItemUnitCard({
  itemUnit,
  item,
  onClick,
  disabled = false,
}: ItemUnitCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(false);

  const statusConfig = ITEM_UNIT_STATUS_CONFIG[itemUnit?.status];

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(itemUnit)}
      disabled={disabled}
      className={`group w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-gray-300 text-left ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* Image */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {!error && itemUnit?.image_path ? (
          <img
            src={itemUnit.image_path}
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
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Row 1: code + type */}
        <div className="flex items-center gap-2"></div>
        {/* Row 2: name */}
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {itemUnit?.name ?? item?.name}
        </p>
        {/* Row 3: brand · model */}
        {(itemUnit?.brand || itemUnit?.model) && (
          <p className="text-xs text-gray-500 truncate">
            {[itemUnit?.brand, itemUnit?.model].filter(Boolean).join(" · ")}
          </p>
        )}
        {/* Row 4: location */}
        <div className="flex items-center">
          {!itemUnit?.location_id ? (
            <span className="flex items-center text-red-400 gap-1">
              <MdLocationOff className="text-xs" />
              <p className="text-xs">Sin ubicación</p>
            </span>
          ) : (
            <span className="flex items-center text-blue-400 gap-1">
              <MdLocationOn className="text-xs" />
              <p className="text-xs">{itemUnit?.location_name}</p>
            </span>
          )}

          {itemUnit?.status === "RENTED" && (
            <span className="text-[11px] text-blue-400">En uso</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {itemUnit?.condition &&
            (() => {
              const conditionConfig = ITEM_CONDITION_CONFIG[itemUnit.condition];
              return (
                <span className="text-[10px] text-gray-400 uppercase">
                  <PrimaryBadge
                    label={conditionConfig?.label}
                    variant={conditionConfig?.className}
                  />
                </span>
              );
            })()}

          {itemUnit?.status &&
            (() => {
              const statusConfig = ITEM_UNIT_STATUS_CONFIG[itemUnit.status];
              return (
                <span className="text-[10px] text-gray-400 uppercase">
                  <PrimaryBadge
                    label={statusConfig?.label}
                    className={statusConfig?.className}
                  />
                </span>
              );
            })()}
        </div>
        \{/* Row 5: observations */}
        {itemUnit?.observations && (
          <p className="text-[11px] text-gray-400 truncate mt-1">
            {itemUnit.observations}
          </p>
        )}
      </div>
    </button>
  );
}
