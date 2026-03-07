import { useState } from "react";

type Option = {
  id: string;
  name: string;
};

type FormSelectSearchProps = {
  label: string;
  value?: Option | null;
  options: any[];
  placeholder?: string;
  onSelect: (e: any) => void;
};

export default function FormSelectSearch({
  label,
  value,
  options,
  placeholder = "Seleccionar...",
  onSelect,
}: FormSelectSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center
        rounded-lg border px-3 py-2 text-sm bg-white
        hover:bg-gray-50"
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value?.name || placeholder}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg"
        >
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b px-3 py-2 text-sm
            focus:outline-none"
          />

          <div className="max-h-52 overflow-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">
                Sin resultados
              </p>
            )}

            {filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-3 py-2 text-sm
                hover:bg-blue-50"
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
