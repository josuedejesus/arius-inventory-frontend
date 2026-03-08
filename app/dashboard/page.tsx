"use client";
import { useCallback, useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import axios from "axios";
import { ItemUnitStatus } from "../components/item-units/types/item-units-status.enum";
import Modal from "../components/Modal";
import DataGrid, { ColumnDef } from "../components/DataGrid";
import ItemUnitCard from "../components/cards/ItemUnitCard";
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

const columns: ColumnDef<any>[] = [
  { key: "internal_code", title: "Código" },

  { key: "name", title: "Artículo" },

  { key: "brand", title: "Marca" },

  { key: "model", title: "Modelo" },

  { key: "unit_code", title: "Unidad" },

  { key: "status", title: "Estado" },

  { key: "location", title: "Ubicación" },
];

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [itemUnitsStats, setItemUnitsStats] = useState<any>(undefined);
  const [locationsStats, setLocationsStats] = useState<any[]>([]);
  const [supplesStats, setSuppliesStats] = useState<any>(undefined);
  const [activeLocations, setActiveLocations] = useState<number>(0);
  const [locations, setLocations] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(undefined);
  const [stockLevels, setStockLevels] = useState<any[]>([]);

  const [showItemsModal, setShowItemsModal] = useState(false);
  const [modalItems, setModalItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const [itemUnits, setItemUnits] = useState<any[]>([]);

  const handleGetItemUnitsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/get-stats`);
      console.log(response.data.data);
      setItemUnitsStats(response.data.data);
    } catch (error: any) {}
  };

  const handleGetLocationsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations/get-stats`);
      console.log(response.data.data);
      const stats = response.data.data;
      setLocations(stats.locations);
      setActiveLocations(stats.active_locations);
      console.log(stats.active_locations);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetSuppliesStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-supplies-stats`);
      console.log("supplies stats:", response.data.data);
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
      console.log(response.data.data);
      setUserStats(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetStockLevels = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-stock-levels`);
      console.log("stock levels", response.data);
      setStockLevels(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetItemUnits = async (filters?: any) => {
    try {
      setLoadingItems(true);
      console.log(filters);
      const response = await axios.get(`${apiUrl}/item-units`, {
        params: filters,
      });
      setItemUnits(response.data.data);
      setShowItemsModal(true);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoadingItems(false);
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Equipos con seguimiento"
          count={itemUnitsStats?.total_units}
          icon={<MdInventory />}
        >
          {/* Stats rows */}
          <div className="space-y-1 text-sm">
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
                <span>Disponibles</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-600">
                  {itemUnitsStats?.available_units}
                </span>
              </div>
            </button>

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
                <span className="text-orange-500">●</span>
                <span>Reservados</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-orange-400">
                  {itemUnitsStats?.reserved_units}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleGetItemUnits({ withoutLocation: true })}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-500">●</span>
                <span>Sin ubicación</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-400">
                  {itemUnitsStats?.without_location}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleGetItemUnits({ status: "RENTED" })}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-400">●</span>
                <span>Rentados</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-500">
                  {itemUnitsStats?.rented_units}
                </span>
              </div>
            </button>

            <button
              onClick={() => handleGetItemUnits({ status: "IN_TRANSIT" })}
              className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
    text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">●</span>
                <span>En tránsito</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-yellow-400">
                  {itemUnitsStats?.in_transit_units}
                </span>
              </div>
            </button>
          </div>
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
                  onClick={(e: any) =>
                    handleGetItemUnits({ locationId: e?.id })
                  }
                />
              ))
            ) : (
              <p className="text-xs text-gray-400">Sin datos</p>
            )}
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
        <StatCard
          title="Usuarios activos"
          count={userStats?.length}
          icon={<MdPerson />}
        >
          <div className="space-y-1 text-sm">
            {userStats?.map((user: any) => (
              <div
                key={user.person_id}
                className="group bg-white border border-gray-100 rounded-xl px-4 py-3
  hover:border-gray-200 hover:shadow-sm transition-all duration-150"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm text-gray-800">{user.person_name}</h3>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  {/* Locations */}
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MdLocationOn className="text-blue-500 text-base" />
                    <span className="font-medium text-gray-700">
                      {user.total_locations}
                    </span>
                    <span className="text-xs text-gray-400">ubicaciones</span>
                  </div>

                  {/* Units */}
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MdInventory className="text-emerald-500 text-base" />
                    <span className="font-medium text-gray-700">
                      {user.total_units}
                    </span>
                    <span className="text-xs text-gray-400">equipos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"></div>

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
            gridTemplate="4fr 2fr 2fr 2fr"
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
              <ItemUnitCard itemUnit={row} onClick={console.log} />
            )}
          />
        )}
      </Modal>
    </div>
  );
}
