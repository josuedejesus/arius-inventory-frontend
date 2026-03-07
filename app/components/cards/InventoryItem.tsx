import { useState } from "react";
import { GoPackage } from "react-icons/go";

type InventoryItemCardProps = {
  item: any;
  location: any;
  onClick: (item: any) => void;
};

export default function InventoryItem({
  item,
  location,
  onClick,
}: InventoryItemCardProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState<boolean>(false);

  const [units, setUnits] = useState<any>([]);

  const [error, setError] = useState(false);

  const available = Number(item.availablecount) || 0;
  const existing = Number(item.minimum_stock) || 0;
  const minimum = Number(item.minimum_stock) || 0;

  const ratio = minimum > 0 ? available / minimum : 1;

  const barPercent = Math.min(ratio * 50, 100);

  const barColor =
    ratio >= 2 ? "bg-green-500" : ratio >= 1 ? "bg-yellow-500" : "bg-red-500";

  const availabilityPercent =
    existing > 0 ? Math.round((available / existing) * 100) : 0;

  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div
      className="
    bg-white border rounded-xl
    hover:shadow-md transition
    cursor-pointer overflow-hidden
  "
    >
      <div
        className="p-4 grid grid-cols-[40px_1fr_auto] gap-3 items-center"
        onClick={() => {
          onClick(item);
        }}
      >
        {/* ICON */}
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <GoPackage />
        </div>

        {/* INFO */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">{item.name}</p>

          <p className="text-sm text-gray-500">
            {item.brand} · {item.model || "—"}
          </p>
        </div>

        {/* BADGE */}
        <div className="text-right">
          <span
            className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${
            available > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }
        `}
          >
            {available > 0 ? `${available}` : "0"}/{existing}
          </span>

          {/* PROGRESS BAR */}
          <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`
        h-full transition-all duration-300
        ${barColor}
      `}
                style={{ width: `${barPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-gray-500 mt-1">
              {available} disponibles · mínimo {minimum}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
