import { ItemViewModel } from "../types/item-view.model";

type Props = {
  item: any;
};

export default function MinimalItemCard({ item }: Props) {
  const stock = Number(item.stock || 0);
  const min = Number(item.minimum_stock || 0);

  const isLow = stock <= min;

  return (
    <div
      key={item.id}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
    >
      {/* 🔷 INFO */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {item.name}
        </p>

        <p className="text-xs text-gray-400 truncate">
          {item.brand || "Sin marca"}
          {item.model && ` • ${item.model}`}
        </p>
      </div>

      {/* 🔷 STOCK */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${
            isLow
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {stock}
        </span>

        <span className="text-[10px] text-gray-400">
          min {min}
        </span>
      </div>
    </div>
  );
}