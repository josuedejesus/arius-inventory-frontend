import { useState } from "react";

type ItemPickerProps = {
  items: any[];
  onClick: (item: any) => void;
};

export default function ItemPicker({ items, onClick }: ItemPickerProps) {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <div className="w-full space-y-2">
      {/* Empty state */}
      {items.length === 0 && (
        <div className="rounded-md border border-dashed p-4 text-center">
          <p className="text-sm text-gray-400">No hay artículos disponibles</p>
        </div>
      )}

      {/* List */}
      {items.length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-md border bg-white divide-y">
          {items.map((i: any) => {
            const isSelected = selectedItem?.id === i.id;

            return (
              <button
                key={i.id}
                type="button"
                onClick={() => {
                  onClick(i);
                  setSelectedItem(i);
                }}
                className={`relative w-full px-4 py-3 text-left transition
              ${isSelected ? "bg-blue-50" : "hover:bg-gray-50 focus:bg-gray-50"}
            `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                )}

                <div className="flex flex-col">
                  {/* Nombre */}
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-blue-700" : "text-gray-800"
                    }`}
                  >
                    {i.name}
                  </span>

                  {/* Marca + modelo */}
                  {(i.brand || i.model) && (
                    <span className="text-xs text-gray-500">
                      {i.brand} {i.brand && i.model && "·"} {i.model}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
