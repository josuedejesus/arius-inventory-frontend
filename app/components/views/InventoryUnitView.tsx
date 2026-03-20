import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FormTabPanel from "../form/FormTabPanel";
import FormTabs from "../form/FormTabs";
import StockMoveCard from "../cards/StockMoveCard";
import FormSection from "../form/FormSection";
import ItemUnitCard from "../../dashboard/items/cards/ItemUnitCard";
import Meta from "../Meta";
import { UnitUsageCard } from "../cards/UnitUsageCard";

type ItemStatus = "AVAILABLE" | "RENTED" | "DAMAGED" | "LOST";

type ItemUnit = {
  id: string;
  internal_code: string;
  status: ItemStatus;
  condition: string;
  description?: string;
  observations?: string;
  serial_number?: string;
  image_path?: string;
  location_name?: string; // opcional si ya lo traes del backend
};

type InventoryUnitViewProps = {
  unitId: string;
};

export default function InventoryUnitView({ unitId }: InventoryUnitViewProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [unit, setUnit] = useState<ItemUnit | null>(null);

  const [moves, setMoves] = useState<any[]>([]);

  const [stats, setStats] = useState<any>(undefined);

  const [selectedTab, setSelectedTab] = useState<string>("movements");

  const [usageLogs, setUsateLogs] = useState<any[]>([]);

  const handleGetUnit = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/${unitId}`);
      setUnit(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.message);
      } else {
      }
    }
  };

  const handleGetMovements = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/stock-moves/get-by-item-unit/${unitId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setMoves(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
      }
    }
  };

  const handleGetStats = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-unit-stats/${unitId}`,
      );

      setStats(response.data.data);
    } catch (error: any) {}
  };

  const handleGetUsageLogs = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-unit-usage-logs/get-by-item-unit/${unitId}`,
      );

      console.log('el uso es: ', response.data.data);

      setUsateLogs(response.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUnit();
    handleGetMovements();
    handleGetStats();
    handleGetUsageLogs();
  }, []);

  return (
    <div className="space-y-4">
      <FormTabs
        value={selectedTab}
        onChange={setSelectedTab}
        tabs={[
          { key: "movements", label: "Movimientos" },
          { key: "usage", label: "Registros de uso" },
        ]}
      />

      <div className="flex space-x-2">
        <Meta label="Ubicacion actual" value={unit?.location_name} />
        <Meta
          label="Dias en ubicacion"
          value={stats?.days_in_current_location}
        />
      </div>

      <FormTabPanel when="movements" value={selectedTab}>
        <FormSection
          title="Movimientos"
          description="Movimientos por artículo."
        >
          <div className="flex flex-col gap-4">
            {moves.length ? (
              moves.map((m: any) => <StockMoveCard key={m.id} move={m} />)
            ) : (
              <p className="">No hay datos</p>
            )}
          </div>
        </FormSection>
      </FormTabPanel>

      <FormTabPanel when="usage" value={selectedTab}>
        <FormSection
          title="Registros de uso "
          description="Movimientos por artículo."
        >
          <div className="flex flex-col gap-4">
            {usageLogs.length ? (
              usageLogs.map((m: any) => <UnitUsageCard key={m.id} usage={m}/>)
            ) : (
              <p className="text-black">No hay datos</p>
            )}
          </div>
        </FormSection>
      </FormTabPanel>
    </div>
  );
}
