import { ITEM_CONDITION_CONFIG } from "@/constants/ItemCondition";
import { ITEM_STATUS_CONFIG } from "@/constants/ItemStatus";
import { useState } from "react";
import { MdLocationOff, MdLocationOn } from "react-icons/md";
import { PrimaryBadge } from "../PrimaryBadge";
import { ItemViewModel } from "@/app/dashboard/items/types/item-view.model";
import { ItemUnitViewModel } from "@/app/dashboard/items/types/item-unit-view.model";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypes";

type ItemUnitCardProps = {
  itemUnit: ItemUnitViewModel;
  item?: any;
  onClick: (item: any) => void;
};

export default function ItemUnitCard({
  itemUnit,
  item,
  onClick,
}: ItemUnitCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(false);

  const statusConfig = ITEM_STATUS_CONFIG[itemUnit?.status];

  console.log(itemUnit);

  return (
    <button
      type="button"
      onClick={() => onClick(itemUnit)}
      className="group w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left"
    >
      {/* Image */}
      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={
            !error && itemUnit?.image_path
              ? `${apiUrl}/uploads/${itemUnit?.image_path}`
              : "/placeholder-unit.png"
          }
          onError={() => setError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Row 1: code + type */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold text-gray-400 tracking-widest uppercase">
            {itemUnit?.internal_code}
          </span>

          {itemUnit?.type && (
            <span className="text-[10px] text-gray-400 uppercase">
              {ITEM_TYPE_LABELS[itemUnit.type]}
            </span>
          )}
        </div>

        {/* Row 2: name */}
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {itemUnit?.name ?? item?.name}
        </p>

        {/* Row 3: brand · model */}
        {(itemUnit?.brand || itemUnit?.model) && (
          <p className="text-xs text-gray-400 truncate">
            {[itemUnit?.brand, itemUnit?.model].filter(Boolean).join(" · ")}
          </p>
        )}

        {/* Row 4: location */}
        <div className="flex items-center gap-1.5 mt-1">
          {!itemUnit?.location_id ? (
            <span className="flex items-center text-red-400 gap-1">
              <MdLocationOff className="text-xs" />
              <p className="text-xs">Sin ubicación</p>
            </span>
          ) : (
            <span className="flex items-center text-blue-400 gap-1">
              <MdLocationOn className="text-xs" />
              <p className="text-xs">{itemUnit?.location}</p>
            </span>
          )}

          {itemUnit?.status === "RENTED" && (
            <span className="text-[11px] text-blue-400">En uso</span>
          )}
        </div>

        {/* Row 5: observations */}
        {itemUnit?.observations && (
          <p className="text-[11px] text-gray-400 truncate mt-1">
            {itemUnit.observations}
          </p>
        )}
      </div>

      {/* Right column: status + condition */}
      <div className="flex flex-col items-end gap-1.5">
        {statusConfig && (
          <PrimaryBadge
            label={ITEM_STATUS_CONFIG[itemUnit?.status].label}
            variant={ITEM_STATUS_CONFIG[itemUnit?.status].className}
          />
        )}

        {itemUnit?.condition && ITEM_CONDITION_CONFIG[itemUnit.condition] && (
          <PrimaryBadge
            label={ITEM_CONDITION_CONFIG[itemUnit.condition]?.label}
            variant={ITEM_CONDITION_CONFIG[itemUnit.condition]?.className}
          />
        )}
      </div>
    </button>
  );
}
