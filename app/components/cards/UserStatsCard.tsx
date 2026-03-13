import axios from "axios";
import { useEffect, useState } from "react";
import { MdLocationOn, MdInventory } from "react-icons/md";
import { toast } from "sonner";
import LoadingScreen from "../LoadingScreen";
import { time } from "console";

type Props = {
  userStat: any;
};

export default function UserStatCard({ userStat }: Props) {
  const [open, setOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [locations, setLocations] = useState<any[]>([]);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setOpen((prev) => !prev);

    setLoading(true);

    try {
      await Promise.all([handleGetLocations(), handleGetItemUnits()]);
    } catch (error: any) {
      toast.error(error.message || "Error obteniendo los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocations = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/persons/${userStat?.person_id}/locations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log(response.data);
      setLocations(response.data);
    } catch (error: any) {
      toast.error("Error obteniendo las ubicaciones del usuario");
    }
  };

  const handleGetItemUnits = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/persons/${userStat?.person_id}/item-units`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log(response.data);
      setItemUnits(response.data);
    } catch (error: any) {
      toast.error("Error obteniendo las unidades de artículo del usuario");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* HEADER */}
      <div
        onClick={handleFetchData}
        className="cursor-pointer px-4 py-3 hover:bg-gray-50 transition"
      >
        <div className="flex justify-between items-center my-1">
          <h3 className="text-sm text-gray-800">{userStat.person_name}</h3>
        </div>
        {!open && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <MdLocationOn className="text-blue-500 text-base" />
              <span className="font-medium text-gray-700">
                {userStat.total_locations}
              </span>
              <span className="text-xs text-gray-400">ubicaciones</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-500">
              <MdInventory className="text-emerald-500 text-base" />
              <span className="font-medium text-gray-700">
                {userStat.total_units}
              </span>
              <span className="text-xs text-gray-400">equipos</span>
            </div>
          </div>
        )}
      </div>

      {/* COLLAPSABLE */}
      {open && (
        <div className="border-t bg-gray-50 px-4 py-3 space-y-3">
          {loading ? (
            <LoadingScreen />
          ) : (
            locations.map((location: any) => (
              <div key={location.id} className="bg-white rounded-lg p-3 border">
                {/* Location */}
                <div className="flex items-center justify-between mb-2">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MdLocationOn className="text-blue-500" />
                    {location.name}
                  </div>

                  {/* Units count */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MdInventory className="text-emerald-500" />
                    <span className="font-medium text-gray-700">
                      {itemUnits.length}
                    </span>
                    <span>equipos</span>
                  </div>
                </div>

                {/* Items */}
                <div className="pl-6 space-y-1">
                  {itemUnits.map((unit: any) => (
                    <div
                      key={unit.id}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <MdInventory className="text-emerald-500 mt-0.5" />

                      <div className="flex flex-col">
                        {/* Item name */}
                        <span className="font-medium text-gray-800">
                          {unit.name}
                        </span>

                        {/* Brand + model */}
                        <span className="text-gray-600">
                          {unit.brand} {unit.model}
                        </span>

                        {/* Internal code */}
                        <span className="text-xs text-gray-400 font-mono">
                          {unit.internal_code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
