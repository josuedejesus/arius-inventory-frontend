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
  MdDashboard,
  MdInventory,
  MdLocationOn,
  MdNotifications,
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
import { ItemUnitViewModel } from "@/app/types/item/item-unit-view.model";
import LocationDashboard from "./components/LocationDashboard";
import UserDashboard from "./components/UserDashBoard";
import ItemUnitsDonut from "../components/ItemUnitsDonut";
import SidePanel from "../components/SidePanel";
import PercentageCard from "../components/cards/PercentageCard";
import ItemUnitDashboard from "./components/ItemUnitDashboard";
import PermissionGuard from "../components/guards/PermissionGuard";
import SummaryCard from "./components/SummaryCard";

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [itemUnitsStats, setItemUnitsStats] = useState<any>(undefined);
  const [supplesStats, setSuppliesStats] = useState<any>(undefined);
  const [activeLocations, setActiveLocations] = useState<number>(0);
  const [locations, setLocations] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(undefined);
  const [stockLevels, setStockLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemUnits, setItemUnits] = useState<ItemUnitViewModel[]>([]);
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [selectedItemUnit, setSelectedItemUnit] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [totalActiveUnits, setTotalActiveUnits] = useState<number>(0);
  useEffect(() => {
    //setLoading(true);
    refreshAll();
  }, []);

  const handleGetItemUnitsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/get-stats`);
      setItemUnitsStats(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetLocationsStats = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations/get-stats`);
      const stats = response.data.data;
      setLocations(stats.locations);
      setActiveLocations(stats.active_locations);
      setTotalActiveUnits(stats.total_units);
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
      console.log("users stats", response.data);
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
    try {
      setLoadingItems(true);
      const response = await axios.get(`${apiUrl}/item-units`, {
        params: filters,
      });
      setItemUnits(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleGetData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/summary/internal`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSummary(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        handleGetData(),
        handleGetItemUnitsStats(),
        handleGetItemUnits(),
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
    "requisition.cancelled": () => {
      toast.info("Una requisición fue cancelada");
      refreshAll();
    }
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <PermissionGuard permission="VIEW_UNITS">
      <div className="space-y-6">
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Equipos"
            icon={<MdInventory />}
            value={summary?.totalItemUnits}
            color="blue"
          />

          <SummaryCard
            label="Ubicaciones activas"
            icon={<MdLocationOn />}
            value={summary?.totalActiveLocations}
            color="green"
          />

          <SummaryCard
            label="Usuarios activos"
            icon={<MdPerson />}
            value={summary?.totalActiveUsers}
            color="yellow"
          />

          <SummaryCard
            label="Insumos"
            icon={<MdCategory />}
            value={summary?.totalSupplies}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatCard
            title="Notificaciones recientes"
            count={0}
            icon={<MdNotifications className="text-yellow-400" />}
          >
            <div className="space-y-2 text-sm">
              {notifications?.map((notification: any) => (
                <div></div>
              ))}
            </div>
          </StatCard>
        </div>

        {/* BOTTOM */}
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
          {/* LEFT */}
          <div className="w-full">
            <StatCard title="Resumen operativo" icon={<MdDashboard />}>
              {/* 🔥 TOP: DONUT + LOCATIONS */}
              <div className="grid grid-cols-1 gap-6 items-center">
                <h4 className="text-sm font-semibold text-gray-700">
                  Estado de los equipos
                </h4>
                {/* DONUT */}
                <div className="flex justify-center">
                  <ItemUnitsDonut stats={itemUnitsStats} />
                </div>
              </div>

              {/* LOCATIONS */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Ubicaciones activas
                </h4>

                {locations.map((location: any) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className="group flex items-center gap-3 w-full px-2 py-2 rounded-lg
            hover:bg-gray-50 transition"
                  >
                    {/* Nombre */}
                    <div className="flex items-center gap-2 w-36 shrink-0">
                      <span className="text-blue-400">●</span>
                      <span className="text-xs truncate text-gray-700">
                        {location.name}
                      </span>
                    </div>

                    {/* Barra */}
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <PercentageCard
                        label="artículos"
                        stock={location.total_units}
                        total={totalActiveUnits}
                        color="blue"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* 🔥 DIVIDER */}
              <div className="border-t my-4" />

              {/* 🔥 USERS */}

              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-semibold text-gray-700">
                  Usuarios activos
                </h4>
                {userStats?.length ? (
                  userStats?.map((user: any) => (
                    <UserStatCard
                      key={user.person_id}
                      stat={user}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserDetails(true);
                      }}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Sin datos</p>
                )}
              </div>
            </StatCard>
          </div>

          {/* RIGHT */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-1 gap-4">
            <StatCard title="Artículos" icon={<MdInventory />}>
              {/* ITEM UNITS */}
              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-semibold text-gray-700">
                  Inventario de equipos
                </h4>
                {itemUnits?.length ? (
                  itemUnits?.map((stat: any) => (
                    <MinimalItemUnitCard
                      key={stat?.id}
                      itemUnit={stat}
                      onClick={() => setSelectedItemUnit(stat)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Sin datos</p>
                )}
              </div>
              {/* 🔥 DIVIDER */}
              <div className="border-t my-4" />

              {/* 🔥 SUPPLIES */}
              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-semibold text-gray-700">
                  Inventario de insumos
                </h4>

                {/* Stock total */}
                <button
                  onClick={() =>
                    handleGetItemUnits({
                      status: "AVAILABLE",
                      requireLocation: true,
                    })
                  }
                  className="group flex justify-between items-center w-full px-3 py-2 rounded-lg
        text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
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
        text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">●</span>
                    <span>Stock bajo</span>
                  </div>

                  <span className="font-semibold text-red-500">
                    {supplesStats?.low_stock_items}
                  </span>
                </button>

                {/* Lista */}
                {stockLevels?.length > 0 && (
                  <div className="mt-3 border-t pt-2 space-y-1">
                    {stockLevels.map((item: any) => (
                      <button
                        key={item.id}
                        className="flex justify-between items-center w-full px-2 py-1 rounded
              hover:bg-red-50 transition text-xs text-gray-600"
                      >
                        <span className="truncate">{item.name}</span>
                        <ItemPercentageCard item={item} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </StatCard>
          </div>
        </div>

        <Modal
          open={showItemModal}
          title="Detalles del artículo"
          onClose={() => setShowItemModal(false)}
        >
          <ItemUnitView itemUnidId={selectedItemUnit?.id} />
        </Modal>

        <SidePanel
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          title="Detalles de la ubicación"
        >
          {selectedLocation && (
            <LocationDashboard locationId={selectedLocation?.id} />
          )}
        </SidePanel>

        <SidePanel
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={"Detalles del usuario"}
        >
          {selectedUser && (
            <UserDashboard
              personId={selectedUser?.person_id}
              userId={selectedUser?.user_id}
            />
          )}
        </SidePanel>

        <SidePanel
          isOpen={!!selectedItemUnit}
          onClose={() => setSelectedItemUnit(null)}
          title={"Detalles del artículo"}
        >
          {selectedItemUnit && (
            <ItemUnitDashboard itemUnitId={selectedItemUnit?.id} />
          )}
        </SidePanel>
      </div>
    </PermissionGuard>
  );
}
