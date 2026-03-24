import { ItemUnitViewModel } from "../types/item-unit-view.model";

type Props = {
  itemUnit: ItemUnitViewModel;
  showStats?: boolean;
};

export default function MinimalItemUnitCard({
  itemUnit,
  showStats = false,
}: Props) {
  console.log("Rendering MinimalItemUnitCard for itemUnit", itemUnit);
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100 gap-3">
      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {itemUnit.name}
        </p>
        <p className="text-xs text-gray-400 truncate">
          <span className="font-mono">{itemUnit.internal_code}</span>
          {itemUnit.brand && ` · ${itemUnit.brand}`}
          {itemUnit.model && ` · ${itemUnit.model}`}
        </p>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {itemUnit.days_in_project != null && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-gray-700">
                {itemUnit.days_in_project}d
              </span>
              <span className="text-[10px] text-gray-400">en proyecto</span>
            </div>
          )}

          {itemUnit.days_in_project != null &&
            itemUnit.estimated_usage_hours != null && (
              <div className="w-px h-6 bg-gray-200" />
            )}

          {itemUnit.estimated_usage_hours != null && (
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-gray-700">
                {Math.round(itemUnit.estimated_usage_hours)}h
              </span>
              <span className="text-[10px] text-gray-400">uso estimado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
