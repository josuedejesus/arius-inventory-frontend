import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import MinimalItemUnitCard from "@/app/dashboard/items/cards/MinimalItemUnitCard";
import { LocationViewModel } from "@/app/dashboard/locations/types/location-view-model";
import MinimalPersonCard from "@/app/dashboard/persons/components/MinimalPersonCard";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdSwapHoriz,
  MdWarehouse,
} from "react-icons/md";
import { toast } from "sonner";
import StockMoveCard from "@/app/components/cards/StockMoveCard";
import ItemUnitCard from "../items/cards/ItemUnitCard";
import PercentageCard from "@/app/components/cards/PercentageCard";
import { ItemUnitViewModel } from "@/app/types/item/item-unit-view.model";

type Props = {
  itemUnitId: number;
};

const ItemUnitDashboard: React.FC<Props> = ({ itemUnitId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [usageLogs, setUsageLogs] = useState<any[]>([]);
  const [itemUnit, setItemUnit] = useState<ItemUnitViewModel | null>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([
        handleGetItemUnit(),
        handleGetUsageLogs(),
        handleGetMovements(),
      ]);
    };
    fetchData();
    setLoading(false);
  }, [itemUnitId]);

  const handleGetItemUnit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/item-units/${itemUnitId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("item units por ubicación", response.data);
      setItemUnit(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetUsageLogs = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/${itemUnitId}/usage-logs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setUsageLogs(response.data.locations);
      setTotalUsage(response.data.total_usage);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  const handleGetMovements = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/stock-moves/${itemUnitId}/item-unit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      console.log("movimientos", response.data);
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
      <ItemUnitCard itemUnit={itemUnit!} />

      {/* 🔷 KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard title="Personal" value={usageLogs?.length || 0} />
        <KpiCard title="Equipos" value={itemUnit ? 1 : 0} />
        <KpiCard title="Suministros" value={items?.length || 0} />
      </div>

      {/* 🔷 GRID PRINCIPAL */}
      <div className="grid sm:grid-cols-1 gap-6">
        {/* USAGE */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="flex items-center font-semibold text-gray-600 mb-3">
            <MdWarehouse className="inline-block mr-2" />
            Uso registrado por ubicación
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {usageLogs?.length ? (
              usageLogs.map((log) => (
                <button
                  className="group flex gap-3 w-full px-2 py-2 rounded-lg
            hover:bg-gray-50 transition"
                >
                  {/* Nombre */}
                  <div className="flex items-center gap-2 w-36 shrink-0">
                    <span className="text-blue-400">●</span>
                    <span className="text-xs truncate text-gray-700">
                      {log.location_name}
                    </span>
                  </div>

                  {/* Barra */}
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <PercentageCard
                      key={log.id}
                      label="horas"
                      stock={log?.hours}
                      total={totalUsage}
                    />
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400">Sin uso registrado</p>
            )}
          </div>
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
              <StockMoveCard
                key={m.id}
                label={
                  <p>
                    {m.source_location_name
                      ? m.source_location_name
                      : m.destination_location_name}
                  </p>
                }
                movement={m}
              />
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

export default ItemUnitDashboard;
