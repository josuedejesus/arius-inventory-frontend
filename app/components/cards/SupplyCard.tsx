import { ITEM_CONDITION_CONFIG } from "@/constants/ItemCondition";
import { ITEM_STATUS_CONFIG } from "@/constants/ItemStatus";
import { useState } from "react";
import { MdLocationOff, MdLocationOn, MdNoPhotography } from "react-icons/md";
import { PrimaryBadge } from "../badges/PrimaryBadge";
import { ItemViewModel } from "@/app/dashboard/items/types/item-view.model";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";

type itemCardProps = {
  item?: ItemViewModel;
  onClick: (item: any) => void;
};

export default function itemCard({ item, onClick }: itemCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-full flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left"
    >
     {/* Image */}
           <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
             {!error && item?.image_path ? (
               <img
                 src={item.image_path}
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
          <span className="text-[10px] font-mono font-semibold text-gray-400 tracking-widest uppercase">
            {item?.id}
          </span>

          {item?.type && (
            <span className="text-[10px] text-gray-400 uppercase">
              {ITEM_TYPE_LABELS[item.type]?.label}
            </span>
          )}
        </div>

        {/* Row 2: name */}
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {item?.name ?? item?.name}
        </p>

        {/* Row 3: brand · model */}
        {(item?.brand || item?.model) && (
          <p className="text-xs text-gray-400 truncate">
            {[item?.brand, item?.model].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </button>
  );
}
