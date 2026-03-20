import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../../components/SearchBar";
import FormTabs from "../../../components/form/FormTabs";
import FormTabPanel from "../../../components/form/FormTabPanel";
import FormSection from "../../../components/form/FormSection";
import { toast } from "sonner";
import ItemUnitCard from "../cards/ItemUnitCard";
import SupplyCard from "../../../components/cards/SupplyCard";
import { RequisitionType } from "../../requisitions/types/requisition-type.enum";

type AddItemsFormProps = {
  itemUnits: any[];
  supplies: any[];
  onAdd: (items: any) => void;
  onAddSupply: (item: any) => void;
  requisitionType: RequisitionType;
};

export default function AddItemsForm({
  itemUnits,
  supplies,
  onAdd,
  onAddSupply,
  requisitionType,
}: AddItemsFormProps) {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const [selectedTab, setSelectedTab] = useState<any>("tool");

  const filteredItems = itemUnits.filter((u: any) =>
    `${u.item_name} ${u.model} ${u.brand} ${u.internal_code}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

 const requisitionTabs: Partial<Record<RequisitionType, { key: string; label: string }[]>> = {
  [RequisitionType.ADJUSTMENT]: [
    { key: "tool", label: "Equipo" },
    { key: "supply", label: "Insumo" },
  ],
  [RequisitionType.PURCHASE_RECEIPT]: [
    { key: "tool", label: "Equipo" },
    { key: "supply", label: "Insumo" },
  ],
  [RequisitionType.CONSUMPTION]: [
    { key: "supply", label: "Insumo" },
  ],
};
  return (
    <div className="">
      <FormSection
        title="Articulos"
        description="Lista de articulos disponibles"
      >
        <FormTabs   tabs={requisitionTabs[requisitionType] ?? [{ key: "tool", label: "Equipo" }]}
 value={selectedTab} onChange={setSelectedTab} />
        <SearchBar
          placeholder="Buscar artículo..."
          value={searchValue}
          onChange={setSearchValue}
        />

        <FormTabPanel when="tool" value={selectedTab}>
          <div className="space-y-2">
            {filteredItems.length ? (
              filteredItems.map((i: any) => (
                <ItemUnitCard
                  key={i.id}
                  itemUnit={i}
                  onClick={() => onAdd(i)}
                />
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
        </FormTabPanel>

        <FormTabPanel when="supply" value={selectedTab}>
          <div className="space-y-2">
            {supplies?.length > 0 ? (
              supplies.map((s: any) => (
                <SupplyCard
                  key={s.id}
                  item={s}
                  onClick={(item) => onAddSupply(item)}
                />
              ))
            ) : (
              <p></p>
            )}
          </div>
        </FormTabPanel>
      </FormSection>
    </div>
  );
}
