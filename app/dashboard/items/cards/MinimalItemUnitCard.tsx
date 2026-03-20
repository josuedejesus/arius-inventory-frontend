import { ItemUnitViewModel } from "../types/item-unit-view.model";

type Props = {
  itemUnit: ItemUnitViewModel;
};

export default function MinimalItemUnitCard({ itemUnit }: Props) {
  return (
    <div
      key={itemUnit.id}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {itemUnit.internal_code} • {itemUnit.name}
        </p>

        <p className="text-xs text-gray-400 truncate">
          {itemUnit.brand}
          {itemUnit.model && ` • ${itemUnit.model}`}
        </p>
      </div>
    </div>
  );
}
