type AutoCompleteItem = {
  id: number;
  name: string;
};

type AutoCompleteProps<T extends AutoCompleteItem> = {
  items: T[];
  placeholder?: string;
  onSelect: (item: T) => void;
  onCreate?: (name: string) => void;
};


import { useEffect, useRef, useState } from "react";

export default function Autocomplete<T extends { id: number; name: string }>({
  items,
  placeholder = "Buscar...",
  onSelect,
  onCreate,
}: AutoCompleteProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  // cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-gray-300">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {query && filtered.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onSelect(filtered[0]);
              setQuery("");
              setOpen(false);
            }}
            className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
            title="Agregar"
          >
            +
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white
                        border border-gray-300 rounded-lg shadow max-h-48 overflow-auto text-gray-800">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setQuery("");
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm cursor-pointer
                           hover:bg-gray-50"
              >
                {item.name}
              </div>
            ))
          ) : (
            onCreate && query && (
              <div
                onClick={() => {
                  onCreate(query);
                  setQuery("");
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm text-blue-600
                           cursor-pointer hover:bg-blue-50"
              >
                Crear “{query}”
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

