import { useState } from "react";

type RequisitionItem = {
  item_id: number;
  item_name: string;
  item_unit_id?: string;
  internal_code?: string;
  quantity: number;
  unit_code: string;
  unit_name: string;
  image_path: string;
};

type RequisitionItemCardProps = {
  item: RequisitionItem;
  apiUrl: string;
  onRemove?: (item: RequisitionItem) => void;
};

export default function RequisitionItemCard({
  item,
  apiUrl,
  onRemove,
}: RequisitionItemCardProps) {
  const isTraceable = !!item.item_unit_id;

  const [error, setError] = useState<boolean>(false);

  return (
    <div
      className="w-full flex items-center justify-between gap-4
                 bg-white border rounded-lg px-4 py-3
                 hover:shadow-sm transition"
    >
      {/* Imagen */}
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={
            !error && item.image_path
              ? `${apiUrl}/uploads/${item.image_path}`
              : "/placeholder-unit.png"
          }
          onError={() => setError(true)}
          className="w-full h-full object-cover rounded-md border"
        />
      </div>
      {/* Info principal */}
      <div className="flex-1 min-w-0">
        {/* Nombre */}
        <p className="text-sm font-semibold text-gray-900 truncate">
          {item.item_name}
        </p>

        {/* Detalle */}
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
          {isTraceable ? (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
              {item.internal_code}
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {item.quantity} {item.unit_name}
            </span>
          )}

          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {item.unit_code}
          </span>
        </div>
      </div>

      {/* Cantidad (solo si NO es trazable) */}
      {!isTraceable && (
        <div className="text-sm font-medium text-gray-700">
          × {item.quantity}
        </div>
      )}

      {/* Acción */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(item)}
          className="text-gray-400 hover:text-red-500 text-lg leading-none"
          title="Quitar"
        >
          ×
        </button>
      )}
    </div>
  );
}
