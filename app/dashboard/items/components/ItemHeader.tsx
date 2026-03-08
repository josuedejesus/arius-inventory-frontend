import { MdInventory } from "react-icons/md";

type Props = {
  item: any;
};

export default function ItemHeader({ item }: Props) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
        <MdInventory className="text-blue-500 text-xl" />
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {item?.type}
          </span>
          {item?.brand && (
            <span className="text-xs text-gray-400">{item.brand}</span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
          {item?.name}
        </p>
        {item?.model && (
          <p className="text-xs text-gray-400 truncate">{item.model}</p>
        )}
      </div>
    </div>
  );
}
