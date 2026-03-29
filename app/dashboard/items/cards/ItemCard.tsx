import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";
import { MdAccessTime, MdBuild, MdInventory } from "react-icons/md";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { ItemType } from "@/app/types/item/item-type.enum";
import { ITEM_CONDITION_CONFIG } from "@/constants/ItemCondition";

type Props = {
  item: any;
};

export default function ItemCard({ item }: Props) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition">
      {/* ICON / IMAGE */}
      <div className="w-12 h-12 rounded-xl bg-gray-50 border flex items-center justify-center shrink-0">
        <MdInventory className="text-blue-500 text-2xl" />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Row 1: code + type */}
        <div className="flex items-center gap-2"></div>
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

        {/* BADGES */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {(() => {
            const typeConfig = ITEM_TYPE_LABELS[item?.type as ItemType];
            return <PrimaryBadge label={typeConfig?.label ?? item?.type} />;
          })()}

          <PrimaryBadge label={item?.unit_name} />
        </div>

        {/* DETAILS */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
          {/* USAGE */}
          {item?.usage_hours && (
            <div className="flex items-center gap-1">
              <MdAccessTime className="text-gray-400" />
              <span>Promedio de uso por día: {item.usage_hours}h</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
