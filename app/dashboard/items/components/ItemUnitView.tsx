import axios from "axios";
import { use, useEffect, useState } from "react";
import { ItemUnitViewModel } from "../types/item-unit-view.model";
import {
  MdBrandingWatermark,
  MdBuild,
  MdInventory,
  MdLocationOn,
  MdQrCode,
} from "react-icons/md";
import ItemUnitUsageCard from "@/app/components/cards/ItemUnitUsageCard";
import { toast } from "sonner";
import LoadingScreen from "@/app/components/LoadingScreen";
import { ITEM_CONDITION_CONFIG } from "@/constants/ItemCondition";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { ITEM_STATUS_CONFIG } from "@/constants/ItemStatus";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";

type Props = {
  itemUnidId: number;
};
export default function ItemUnitView({ itemUnidId }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [itemUnit, setItemUnit] = useState<ItemUnitViewModel | undefined>(
    undefined,
  );
  const [usageStats, setUsageStats] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const handleGetItemUnit = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/${itemUnidId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("data", response.data);
      setItemUnit(response.data.data);
    } catch (error: any) {}
  };

  const handleGetItemUnitsUsage = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/${itemUnidId}/usage-logs`,
        {},
      );
      console.log("logs", response.data);
      setUsageStats(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      // setLoading(false);}
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([handleGetItemUnit(), handleGetItemUnitsUsage()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !itemUnit) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <div className="flex bg-white rounded-2xl border p-5 w-full transition gap-6">
        {/* IMAGE */}
        <div className="w-40 h-40 min-w-[160px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {itemUnit?.image_path ? (
            <img
              src={`${apiUrl}/uploads/${itemUnit.image_path}`}
              alt={itemUnit.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <MdInventory className="text-4xl text-gray-400" />
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 justify-between">
          {/* TOP INFO */}
          <div className="space-y-3">
            {/* Title + Status */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {itemUnit?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {itemUnit?.brand} {itemUnit?.model || ""}
                </p>
              </div>

              <PrimaryBadge
                label={ITEM_STATUS_CONFIG[itemUnit?.status ?? ""]?.label}
                variant={ITEM_STATUS_CONFIG[itemUnit?.status ?? ""]?.className}
              />
            </div>

            {/* GRID INFO */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-blue-400" />
                <span>{itemUnit?.location_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <MdBuild className="text-yellow-500" />
                <span>
                  {ITEM_CONDITION_CONFIG[itemUnit?.condition ?? ""]?.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MdQrCode className="text-purple-500" />
                <span>{itemUnit?.internal_code}</span>
              </div>
              
            </div>

            {/* DESCRIPTION */}
            {itemUnit?.description && (
              <p className="text-sm text-gray-600">{itemUnit.description}</p>
            )}

            {/* OBS */}
            {itemUnit?.observations && (
              <div className="bg-gray-50 border rounded-lg p-2 text-xs text-gray-600">
                <span className="font-medium">Obs:</span>{" "}
                {itemUnit.observations}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t mt-3">
            <span>ID: {itemUnit?.id}</span>
            <span>
              {new Date(itemUnit?.updated_at || "").toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full border-t rounded-2xl bg-gray-50 px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white border border-gray-100 rounded-lg p-2">
            <p className="text-gray-400">Uso total</p>
            <p className="text-gray-700 font-medium">
              {usageStats?.total_usage ?? 0}h
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-2">
            <p className="text-gray-400">Ubicaciones</p>
            <p className="text-gray-700 font-medium">
              {usageStats?.locations?.length ?? 0}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-2">
            <p className="text-gray-400">Último uso</p>
            <p className="text-gray-700 font-medium">
              {usageStats?.last_usage
                ? new Date(usageStats.last_usage).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Usage por ubicación */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Uso por ubicación</p>

          <div className="space-y-2">
            {usageStats?.locations?.length === 0 && (
              <p className="text-xs text-gray-500">Sin registros de uso</p>
            )}
            {usageStats?.locations?.map((loc: any) => (
              <div key={loc.location_id}>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MdLocationOn className="text-blue-500" />
                    {loc.location_name}
                  </span>
                  <span className="text-gray-500">{loc.hours}h</span>
                </div>

                <div className="w-full h-1.5 bg-gray-100 rounded">
                  <div
                    className="h-1.5 bg-blue-400 rounded"
                    style={{ width: `${loc.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        {/*<div>
              <p className="text-xs text-gray-400 mb-2">Actividad reciente</p>

              <div className="space-y-1 text-xs text-gray-500">
                <p>12 Mar · Asignado a Oficina Central</p>
                <p>10 Mar · Uso registrado (4h)</p>
                <p>08 Mar · Movido a Bodega</p>
              </div>
            </div>*/}
      </div>
    </div>
  );
}
