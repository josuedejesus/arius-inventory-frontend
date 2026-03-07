import { formatDate } from "../../../utils/formatters";
import { ItemViewModel } from "../types/item-view.model";

type Item = {
  id: number;
  name: string;
  brand: string;
  model: string;
  type: string;
  tracking: string;
  unit_id: string;
  unit_name: string;
  unit_code: string;
  is_active: boolean;
  updated_at: string;
  username: string;
};

type ItemCardProps = {
  item: ItemViewModel;
  onClick: (item: ItemViewModel) => void;
};

export default function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className="
    cursor-pointer
    px-4 py-3
    grid grid-cols-[15fr_10fr_10fr_2fr]
    items-center gap-4
    bg-white
    border border-gray-100
    hover:bg-gray-50
    transition-colors
    rounded-md
  "
    >
      {/* Nombre */}
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item?.name}
        </p>
        <p className="text-xs text-gray-400 truncate">ID #{item?.id}</p>
      </div>

      {/* Modelo */}
      <p className="text-sm text-gray-700 truncate">{item?.model || "—"}</p>

      {/* Marca */}
      <p className="text-sm text-gray-700 truncate">{item?.brand || "—"}</p>

      {/* Estado */}
      <div className="flex justify-end">
        <span
          className={`inline-flex items-center gap-1.5
        text-xs font-medium
        ${item?.is_active ? "text-green-700" : "text-red-600"}
      `}
        >
          <span
            className={`h-2 w-2 rounded-full
          ${item?.is_active ? "bg-green-500" : "bg-red-500"}
        `}
          />
          {item?.is_active ? "Activo" : "Inactivo"}
        </span>
      </div>
    </div>
  );
}
