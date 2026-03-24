import MinimalItemUnitCard from "@/app/dashboard/items/cards/MinimalItemUnitCard";
import { LocationViewModel } from "@/app/dashboard/locations/types/location-view-model";
import MinimalPersonCard from "@/app/dashboard/persons/components/MinimalPersonCard";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdCategory,
  MdInventory,
  MdLocationOn,
  MdPeople,
  MdPerson,
  MdSwapHoriz,
} from "react-icons/md";
import { toast } from "sonner";
import { PrimaryBadge } from "./badges/PrimaryBadge";
import MinimalItemCard from "../dashboard/items/cards/MinimalItemCard";
import StockMoveCard from "./cards/StockMoveCard";

type Props = {
  locationId: number;
};

const LocationDashboard: React.FC<Props> = ({ locationId }) => {
  const [location, setLocation] = useState<LocationViewModel>();
  const [items, setItems] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([
        handleGetLocation(),
        handleGetStockByLocation(locationId),
        handleGetMembersByLocation(locationId),
        handleGetItemUnits({ locationId: locationId }),
        handleGetMovements({ locationId: locationId }),
      ]);
    };
    fetchData();
  }, [locationId]);

  const handleGetLocation = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setLocation(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMembersByLocation = async (locationId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/persons`, {
        params: { locationId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setStaff(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStockByLocation = async (locationId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/items/${locationId}/get-stock`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setItems(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetItemUnits = async (filters: { locationId: number }) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/item-units/get-all-with-stats/${locationId}/location`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("item units por ubicación", response.data);
      setItemUnits(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMovements = async (filters: { locationId: number }) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/stock-moves/${locationId}/location`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log("movements por ubicación", response.data);
      setMovements(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const skeleton = [1, 2, 3].map((i) => (
    <div
      key={i}
      className="animate-pulse flex justify-between items-center p-2 border rounded-lg"
    >
      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
    </div>
  ));

  if (loading) {
    return skeleton;
  }

  return (
    <div className="space-y-6">
      {/* 🔷 HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div className="space-y-1">
          {/* 🔷 Nombre + tipo */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-800">
              {location?.name}
            </h1>

            {location?.type &&
              (() => {
                const typeConfig = LOCATION_TYPE_CONFIG[location.type];
                const Icon = typeConfig?.icon;

                return (
                  <PrimaryBadge
                    icon={Icon ? <Icon /> : null}
                    label={typeConfig?.label || ""}
                    className={typeConfig?.className}
                  />
                );
              })()}
          </div>

          {/* 📍 Dirección */}
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MdLocationOn className="text-blue-400" />{" "}
            {location?.location || "Sin ubicación"}
          </p>
        </div>
      </div>

      {/* 🔷 KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard title="Personal" value={staff?.length || 0} />
        <KpiCard title="Equipos" value={itemUnits?.length || 0} />
        <KpiCard title="Suministros" value={items?.length || 0} />
      </div>

      {/* 🔷 GRID PRINCIPAL */}
      <div className="grid sm:grid-cols-1 gap-6">
        {/* 👥 STAFF */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="flex items-center font-semibold text-gray-600 mb-3">
            <MdPeople className="inline-block mr-2" />
            Personal asignado
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {staff?.length ? (
              staff.map((s) => <MinimalPersonCard key={s.id} person={s} />)
            ) : (
              <p className="text-sm text-gray-400">Sin personal asignado</p>
            )}
          </div>
        </div>

        {/* 📦 ITEM UNITS */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="flex items-center font-semibold text-gray-600 mb-3">
            <MdInventory className="inline-block mr-2" />
            Equipos asignados
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {itemUnits?.length ? (
              itemUnits.map((iu) => (
                <MinimalItemUnitCard key={iu.id} itemUnit={iu} showStats={true} />
              ))
            ) : (
              <p className="text-sm text-gray-400">Sin equipos asignados</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔷 SUPPLIES */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="flex items-center font-semibold text-gray-600 mb-3">
          <MdInventory className="inline-block mr-2" />
          Inventario de suministros
        </h2>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {items?.length ? (
            items
              .sort((a, b) => a.stock - b.stock) // 🔥 menor stock primero
              .map((s) => <MinimalItemCard key={s.id} item={s} />)
          ) : (
            <p className="text-sm text-gray-400">Sin inventario disponible</p>
          )}
        </div>
      </div>

      {/* 🔷 MOVEMENTS */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="flex items-center font-semibold text-gray-600 mb-3">
          <MdSwapHoriz className="inline-block mr-2" />
          Movimientos recientes
        </h2>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {movements?.length ? (
            movements.map((m) => (
              <StockMoveCard key={m.id} movement={m} locationId={locationId} />
            ))
          ) : (
            <p className="text-sm text-gray-400">Sin movimientos recientes</p>
          )}
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);

export default LocationDashboard;
