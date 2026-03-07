"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FormTabPanel from "../form/FormTabPanel";
import FormTabs from "../form/FormTabs";
import StockMoveCard from "../cards/StockMoveCard";
import ItemUnitCard from "../cards/ItemUnitCard";
import FormSection from "../form/FormSection";
import Modal from "../Modal";
import InventoryUnitView from "./InventoryUnitView";

type Item = {
  id: string;
  name: string;
  brand: string;
  model: string;
  image_path?: string;
  tracking: "SERIAL" | "NONE";
  unit_name: string;
  availableCount: number;
  existenceCount: number;
  description?: string;
};

type InventoryItemViewProps = {
  itemId: string;
};

export default function InventoryItemView({ itemId }: InventoryItemViewProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [item, setItem] = useState<Item | null>(null);
  const [moves, setMoves] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("general");

  const [items, setItems] = useState<any[]>([]);

  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [showSelectedUnit, setShowSelectedUnit] = useState<boolean>(false);

  // -------- FETCH ITEM --------
  const handleGetItem = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/${itemId}`);
      setItem(response.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Error al cargar item");
    }
  };

  const handleGetUnits = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-by-item/${itemId}`,
      );
      console.log(response.data.data);
      setItems(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
    }
  };

  const handleSelectUnit = (unit: any) => {
    console.log("data: ", unit);
    setSelectedUnit(unit?.id);
    setShowSelectedUnit(true);
  };

  useEffect(() => {
    handleGetItem();
    handleGetUnits();
  }, [itemId]);

  if (!item) {
    return <p className="text-sm text-gray-400">Cargando...</p>;
  }

  // -------- CALCULOS --------
  const available = Number(item.availableCount) || 0;
  const existing = Number(item.existenceCount) || 0;

  const availabilityPercent =
    existing > 0 ? Math.round((available / existing) * 100) : 0;

  return (
    <>
      <div className="space-y-4">
        {/* TABS */}

        <FormSection title="" description="">
          <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {item.brand} · {item.model || "—"}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Tracking:{" "}
              <span className="font-medium text-gray-700">
                {item.tracking === "SERIAL" ? "Por unidad" : "Por cantidad"}
              </span>
            </p>

            <div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`
                  h-full transition-all
                  ${
                    availabilityPercent > 50
                      ? "bg-green-500"
                      : availabilityPercent > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                `}
                  style={{ width: `${availabilityPercent}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {available} / {existing} ({availabilityPercent}%)
              </p>
            </div>

            {/* DESCRIPTION */}
            {item.description && (
              <p className="text-sm text-gray-600 border-t pt-3">
                {item.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {items.length ? (
              items.map((u: any) => (
                <ItemUnitCard key={u.id} item={u} onClick={handleSelectUnit} />
              ))
            ) : (
              <p className="text-sm text-gray-400"></p>
            )}
          </div>
        </FormSection>
      </div>
      <Modal
        open={showSelectedUnit}
        title="Articulo"
        onClose={() => setShowSelectedUnit(false)}
      >
        <InventoryUnitView unitId={selectedUnit} />
      </Modal>
    </>
  );
}
