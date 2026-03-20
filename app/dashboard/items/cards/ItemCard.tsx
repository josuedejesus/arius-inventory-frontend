import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";
import { MdAccessTime, MdBuild, MdInventory } from "react-icons/md";
import { ItemType } from "../types/item-type.enum";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";

type Props = {
  item: any;
};

export default function ItemCard({ item }: { item: any }) {
  console.log("Rendering ItemCard for item:", item);
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:shadow-md transition">
      {/* ICON / IMAGE */}
      <div className="w-12 h-12 rounded-xl bg-gray-50 border flex items-center justify-center shrink-0">
        <MdInventory className="text-blue-500 text-2xl" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {item?.name}
            </p>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {item?.brand && (
                <span className="text-xs text-gray-400">{item.brand}</span>
              )}
              {item?.model && (
                <span className="text-xs text-gray-400">• {item.model}</span>
              )}
            </div>
          </div>

          <BooleanBadge
            trueLabel="Activo"
            falseLabel="Inactivo"
            value={item?.is_active}
          />
        </div>

        {/* BADGES */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {(() => {
            const typeConfig = ITEM_TYPE_LABELS[item?.type as ItemType];
            return <PrimaryBadge label={typeConfig?.label ?? item?.type} />;
          })()}

          <BooleanBadge
            trueLabel="Traceable"
            falseLabel="No traceable"
            value={item?.type === ItemType.TOOL}
          />

          <PrimaryBadge label={item?.unit_name} />
        </div>

        {/* DETAILS */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
          {/* STOCK */}
          <div className="flex items-center gap-1">
            <MdBuild className="text-gray-400" />
            <span>Inventario mínimo: {item?.minimum_stock}</span>
          </div>

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
