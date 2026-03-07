import axios from "axios";
import { useEffect, useState } from "react";
import FormTabs from "./form/FormTabs";
import FormTabPanel from "./form/FormTabPanel";
import FormSection from "./form/FormSection";
import ItemCard from "../dashboard/items/components/ItemCard";
import ItemUnitCard from "./cards/ItemUnitCard";
import { LOCATION_TYPE_LABELS } from "@/constants/LocationTypes";
import MovementRow from "./MovementRow";
import { toast } from "sonner";
import SearchBar from "./SearchBar";

type LocationInventoryProps = {
  location: any;
};

export default function LocationInventory({
  location,
}: LocationInventoryProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [selectedTab, setSelectedTab] = useState<string>("items");

  const [items, setItems] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");

  const filteredMovements = movements.filter((m: any) =>
    `${m.internal_code} ${m.item_name} ${m.item_brand} ${m.item_model} ${m.executed_at} `
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const handleGetLocationItems = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-by-location/${location?.id}`,
      );

      setItems(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleGetMovements = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/stock-moves/get-by-location/${location?.id}`,
      );

      console.log(response.data.data);
      setMovements(response.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    //handleGetLocation();
    handleGetLocationItems();
    handleGetMovements();
  }, []);

  return (
    <div>
      <FormTabs
        tabs={[
          { key: "items", label: "Articulos" },
          { key: "movements", label: "Movimientos" },
        ]}
        value={selectedTab}
        onChange={setSelectedTab}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">
            {location?.name}
          </h3>

          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {LOCATION_TYPE_LABELS[location?.type]}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">{location?.location}</div>
      </div>

      <FormTabPanel when="items" value={selectedTab}>
        <FormSection
          title="Articulos"
          description="Inventario de artículos almacenados en esta ubicación, con detalle de existencias y unidades por artículo."
        >
          {items.length ? (
            items.map((i: any) => (
              <ItemUnitCard key={i.id} item={i} onClick={console.log} />
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No hay artículos registrados en esta ubicación.
            </div>
          )}
        </FormSection>
      </FormTabPanel>

      <FormTabPanel when="movements" value={selectedTab}>
        <FormSection
          title="Movimientos"
          description="Registro cronológico de los movimientos de inventario, incluyendo entradas y salidas realizadas en esta ubicación."
        >
          <SearchBar
            value={searchValue}
            placeholder="Buscar movimientos..."
            onChange={setSearchValue}
          />
          <div className="bg-white rounded-lg border divide-y">
            {filteredMovements.map((m) => (
              <MovementRow key={m.id} movement={m} locationId={location?.id} />
            ))}
          </div>
        </FormSection>
      </FormTabPanel>
    </div>
  );
}
