import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import FormTabs from "./form/FormTabs";
import FormTabPanel from "./form/FormTabPanel";
import FormSection from "./form/FormSection";
import { toast } from "sonner";
import ItemUnitCard from "./cards/ItemUnitCard";
import LocationLineCard from "./cards/LocationLineCard";

type AddItemsFormProps = {
  lines: any[];
  onAdd: (items: any, accessories: any[]) => void;
};

export default function AddLinesForm({ lines, onAdd }: AddItemsFormProps) {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredLines = lines.filter((u: any) =>
    `${u.item_name} ${u.model} ${u.brand} ${u.internal_code}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const handleAdd = (line: any) => {
    onAdd(line, []);
  };

  useEffect(() => {
    //handleGetItemUnits();
  }, []);

  return (
    <div className="">
      <FormSection
        title="Articulos"
        description="Lista de articulos disponibles"
      >
        <SearchBar
          placeholder="Buscar artículo..."
          value={searchValue}
          onChange={setSearchValue}
        />

        <div className="h-[500px] flex flex-col bg-blue-50/40 border border-blue-100 rounded-2xl p-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-blue-900">
                Devolución de Equipos
              </h2>
              <p className="text-xs text-blue-700">
                Selecciona la unidad que deseas devolver
              </p>
            </div>

            <div className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {lines.length} unidades
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredLines.length ? (
              filteredLines.map((line: any) => (
                <LocationLineCard key={line.id} line={line} onAdd={handleAdd} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                  <span className="text-gray-400 text-xl">📦</span>
                </div>

                <p className="text-sm font-medium text-gray-700">
                  No hay artículos disponibles
                </p>

                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Todos los artículos ya fueron agregados o no hay coincidencias
                  para esta selección.
                </p>
              </div>
            )}
          </div>
        </div>
      </FormSection>
    </div>
  );
}
