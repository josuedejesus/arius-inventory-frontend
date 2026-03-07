type AddedItemsContainerProps = {
  placeholder: string;
  items: any[];
  onRemove: (id: any) => void;
};

export default function AddedItemsContainer({
  placeholder,
  items,
  onRemove,
}: AddedItemsContainerProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.length === 0 && (
        <p className="text-sm text-gray-400 mt-2">
          No se han agregado {placeholder}
        </p>
      )}

      {items.map((a: any) => (
        <div
          key={a.id}
          className="flex items-center gap-2 px-3 py-1
                             bg-gray-100 text-sm text-gray-700
                             rounded-full"
        >
          <span>{a.name}</span>

          <button
            type="button"
            onClick={() => onRemove(a.id)}
            className="text-gray-400 hover:text-red-500"
            title="Quitar"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
