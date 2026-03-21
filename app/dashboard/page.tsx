"use client";
import { use, useCallback, useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import axios from "axios";
import { ItemUnitStatus } from "../components/item-units/types/item-units-status.enum";
import Modal from "../components/Modal";
import DataGrid, { ColumnDef } from "../components/DataGrid";
import ItemUnitCard from "./items/cards/ItemUnitCard";
import { toast } from "sonner";
import { LOCATION_TYPE_LABELS } from "@/constants/LocationTypes";
import { stat } from "fs";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { LocationType } from "./locations/types/location-type.enum";
import LocationStatcard from "../components/cards/LocationStatCard";
import {
  MdAddBox,
  MdCategory,
  MdInventory,
  MdLocationOn,
  MdPerson,
  MdWarningAmber,
} from "react-icons/md";
import ItemPercentageCard from "../components/cards/ItemPercentageCard";
import { MoonLoader } from "react-spinners";
import { useSSE } from "@/hooks/userSSE";
import LoadingScreen from "../components/LoadingScreen";
import UserStatCard from "../components/cards/UserStatsCard";
import ItemUnitUsageCard from "../components/cards/ItemUnitUsageCard";
import ItemUnitView from "./items/components/ItemUnitView";
import PagedDataGrid from "../components/paged-datagrid/PagedDatagrid";
import MinimalItemUnitCard from "./items/cards/MinimalItemUnitCard";
import { ItemUnitViewModel } from "./items/types/item-unit-view.model";
import LocationDashboard from "../components/LocationDashboard";
import UserDashboard from "../components/UserDashBoard";
import ItemUnitsDonut from "../components/ItemUnitsDonut";

const columns: ColumnDef<any>[] = [
  { key: "item", title: "Artículo" },
  { key: "status", title: "Estado" },
];

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [itemUnitsStats, setItemUnitsStats] = useState<any>(undefined);
  const [supplesStats, setSuppliesStats] = useState<any>(undefined);
  const [activeLocations, setActiveLocations] = useState<number>(0);
  const [locations, setLocations] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(undefined);
  const [stockLevels, setStockLevels] = useState<any[]>([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [unitsForStats, setUnitsForStats] = useState<any[]>([]);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [selectedItemUnit, setSelectedItemUnit] = useState<any>(null);
  const [showLocationItems, setShowLocationItems] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const handleGetItemUnitsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/get-stats`);
      console.log("item units stats", response.data);
      setItemUnitsStats(response.data.data);
    } catch (error: any) {}
  };

  const handleGetLocationsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations/get-stats`);
      const stats = response.data.data;
      setLocations(stats.locations);
      setActiveLocations(stats.active_locations);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetSuppliesStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-supplies-stats`);
      const stats = response.data.data;
      setSuppliesStats(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetUsersStats = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-stats-by-users`,
      );
      setUserStats(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetStockLevels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-stock-levels`);
      setStockLevels(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetItemUnits = async (filters?: any) => {
    console.log("fetching item units with filters", filters);
    try {
      setLoadingItems(true);
      const response = await axios.get(`${apiUrl}/item-units`, {
        params: filters,
      });
      console.log("item units", response.data);
      setItemUnits(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleGetItemUnitForStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units`);
      setUnitsForStats(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
    }
  };

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        handleGetItemUnitsStats(),
        handleGetLocationsStats(),
        handleGetSuppliesStats(),
        handleGetUsersStats(),
        handleGetStockLevels(),
      ]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useSSE({
    "requisition.created": () => {
      toast.info("Nueva requisición creada");
      refreshAll();
    },
    "requisition.approved": () => {
      toast.info("Una requisición fue aprobada");
      refreshAll();
    },
    "requisition.executed": () => {
      toast.info("Una requisición fue ejecutada");
      refreshAll();
    },
    "requisition.received": () => {
      toast.info("Una requisición fue recibida");
      refreshAll();
    },
  });

  useEffect(() => {
    setLoading(true);
    refreshAll();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard
          title="Equipos con seguimiento"
          count={itemUnitsStats?.total_units}
          icon={<MdInventory />}
        >
          <ItemUnitsDonut stats={itemUnitsStats} />
        </StatCard>

        <StatCard
          title="Ubicaciones activas"
          count={locations?.length}
          icon={<MdLocationOn />}
        >
          {/* Stats rows */}
          <div className="space-y-2 text-sm">
            {locations?.length ? (
              locations?.map((stat: any) => (
                <LocationStatcard
                  key={stat?.id}
                  stat={stat}
                  onClick={(e: any) => {
                    setSelectedLocation(stat);
                    handleGetItemUnits({
                      locationId: stat?.id,
                    });
                    setShowLocationItems(true);
                  }}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">Sin datos</p>
            )}
          </div>
        </StatCard>

        <StatCard
          title="Usuarios activos"
          count={userStats?.length}
          icon={<MdPerson />}
        >
          <div className="space-y-2 text-sm">
            {userStats?.map((user: any) => (
              <UserStatCard
                key={user.id}
                stat={user}
                onClick={() => {
                  console.log("selected user", user);
                  setSelectedUser(user);
                  setShowUserDetails(true);
                }}
              />
            ))}
          </div>
        </StatCard>

        <StatCard
          title="Insumos"
          count={supplesStats?.total_users}
          icon={<MdCategory />}
        >
          {/* Stats rows */}
          <div className="space-y-1 text-sm">
            {/* Stock total */}
            <button
              onClick={() =>
                handleGetItemUnits({
                  status: "AVAILABLE",
                  requireLocation: true,
                })
              }
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span>Stock total</span>
              </div>

              <span className="font-semibold text-green-600">
                {supplesStats?.total_stock}
              </span>
            </button>

            {/* Stock bajo */}
            <button
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-400">●</span>
                <span>Stock bajo</span>
              </div>

              <span className="font-semibold text-red-500">
                {supplesStats?.low_stock_items}
              </span>
            </button>

            {/* Lista de bajo stock */}
            <div className="flex items-center gap-2 mt-3 mb-1 text-sm font-medium text-amber-600">
              <span>Insumos por nivel de stock</span>
            </div>
            {stockLevels?.length > 0 && (
              <div className="mt-2 border-t pt-2 space-y-1">
                {stockLevels?.map((item: any) => (
                  <button
                    key={item.id}
                    className="flex justify-between items-center w-full px-2 py-1 rounded
          hover:bg-red-50 transition text-xs text-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{item.name}</span>
                    </div>

                    <ItemPercentageCard item={item} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </StatCard>
      </div>

      <Modal
        open={showItemsModal}
        title="Artículos"
        onClose={() => setShowItemsModal(false)}
      >
        {loadingItems ? (
          <p>Cargando...</p>
        ) : (
          <DataGrid
            columns={columns}
            rows={itemUnits}
            gridTemplate=" 2fr 1fr"
            searchKeys={[
              "internal_code",
              "name",
              "brand",
              "model",
              "unit_code",
              "status",
              "location",
            ]}
            renderCard={(row: any) => (
              <ItemUnitCard
                itemUnit={row}
                onClick={() => {
                  setSelectedItemUnit(row);
                  setShowItemModal(true);
                }}
              />
            )}
          />
        )}
      </Modal>

      <Modal
        open={showItemModal}
        title="Detalles del artículo"
        onClose={() => setShowItemModal(false)}
      >
        <ItemUnitView itemUnidId={selectedItemUnit?.id} />
      </Modal>

      <Modal
        open={showLocationItems}
        title={"Detalles de ubicación"}
        onClose={() => setShowLocationItems(false)}
      >
        <LocationDashboard locationId={selectedLocation?.id} />
      </Modal>

      <Modal
        open={showUserDetails}
        title="Detalles del usuario"
        onClose={() => setShowUserDetails(false)}
      >
        <UserDashboard
          personId={selectedUser?.person_id}
          userId={selectedUser?.user_id}
        />
      </Modal>
    </div>
  );
}
