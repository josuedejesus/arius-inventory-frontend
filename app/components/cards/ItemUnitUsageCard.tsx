import axios from "axios";
import { useState } from "react";
import { MdInventory, MdLocationOn } from "react-icons/md";
import { toast } from "sonner";
import LoadingScreen from "../LoadingScreen";

type Props = {
  itemUnit?: any;
};
export default function ItemUnitUsageCard({ itemUnit }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(undefined);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleFetchData = async () => {
    setOpen((prev) => !prev);

    setLoading(true);

    try {
      await Promise.all([handleGetItemUnitsUsage(itemUnit?.id)]);
    } catch (error: any) {
      toast.error(error.message || "Error obteniendo los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleGetItemUnitsUsage = async (id: any) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiUrl}/item-units/${id}/usage-logs`,
        {},
      );
      console.log("logs", response.data);
      setUsageStats(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* HEADER (clickeable) */}
      <div
        onClick={handleFetchData}
        className="cursor-pointer px-4 py-3 hover:bg-gray-50 transition"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <MdInventory className="text-emerald-500 mt-0.5" />

            <div>
              <h3 className="text-sm font-medium text-gray-800">
                {itemUnit?.name}
              </h3>

              <p className="text-xs text-gray-500">{itemUnit?.model}</p>

              <p className="text-xs text-gray-400 font-mono">
                {itemUnit?.internal_code}
              </p>
            </div>
          </div>

          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
            {itemUnit?.status}
          </span>
        </div>
      </div>

      {/* COLLAPSABLE */}
      {open &&
        (loading ? (
          <LoadingScreen />
        ) : (
          <div className="border-t bg-gray-50 px-4 py-4 space-y-4">
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
        ))}
    </div>
  );
}
