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
import EmptyList from "@/app/components/EmptyList";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";
import { ItemType } from "../types/item-type.enum";

type AddItemsFormProps = {
  itemUnits: any[];
  supplies: any[];
  onAdd: (items: any) => void;
  onAddSupply: (item: any) => void;
  requisitionType: RequisitionType;
  destinationLocationId: number | undefined | null;
};

export default function AddItemsForm({
  itemUnits,
  supplies,
  onAdd,
  onAddSupply,
  requisitionType,
  destinationLocationId,
}: AddItemsFormProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<any>("tool");

  const filteredItems = itemUnits.filter((u: any) =>
    `${u.name} ${u.model} ${u.brand} ${u.internal_code}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  return (
    <div className="">
      <FormSection
        title="Articulos"
        description="Lista de articulos disponibles"
      >
        <FormTabs
          tabs={[
            { key: "tool", label: "Equipo" },
            { key: "supply", label: "Suministro" },
          ]
          }
          value={selectedTab}
          onChange={setSelectedTab}
        />
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
                  disabled={i.location_id == destinationLocationId}
                />
              ))
            ) : (
              <EmptyList message="No hay artículos disponibles" icon={ITEM_TYPE_LABELS[ItemType?.TOOL]?.icon} />
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
              <EmptyList  message="No hay suministros disponibles" icon={ITEM_TYPE_LABELS[ItemType?.SUPPLY]?.icon} />
            )}
          </div>
        </FormTabPanel>
      </FormSection>
    </div>
  );
}
