import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../../components/SearchBar";
import FormTabs from "../../../components/form/FormTabs";
import FormTabPanel from "../../../components/form/FormTabPanel";
import FormSection from "../../../components/form/FormSection";
import { toast } from "sonner";
import ItemUnitCard from "../../items/cards/ItemUnitCard";
import NumberSelector from "../../../components/NumberSelector";
import SupplyCard from "../../../components/cards/SupplyCard";
import { RequisitionType } from "../types/requisition-type.enum";
import { PrimaryBadge } from "../../../components/badges/PrimaryBadge";
import { getItemKey } from "@/app/utils/requisition-utils";
import { AddedLineViewModel } from "../dto/added-line-view-model.dto";
import { id } from "date-fns/locale";

type AddSupplyFormProps = {
  selectedItem: AddedLineViewModel;
  item: any;
  requisitionType: RequisitionType | "";
  onAdd: (item: any) => void;
  onClose: () => void;
};

export default function AddSupplyForm({
  selectedItem,
  item,
  requisitionType,
  onAdd,
  onClose,
}: AddSupplyFormProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState<number>(
    selectedItem?.quantity ?? 0.0,
  ); // 👈 si viene quantity la usa
  const isEditing = !!selectedItem?.item_key; // 👈
  const isLimited =
    requisitionType !== RequisitionType.ADJUSTMENT &&
    requisitionType !== RequisitionType.PURCHASE_RECEIPT;
  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    setQuantity(quantity - 1);
  };
  const handleAdd = () => {
    if (quantity <= 0) {
      toast.warning("La cantidad debe ser mayor a 0");
      return;
    }
    const payload: any = {
      id: selectedItem?.id,
      item_key: item.item_key ?? getItemKey(item), // 👈
      item_id: Number(item.item_id ?? item.id),
      name: item.name ?? item.item_name,
      quantity: quantity,
      available_quantity: item.available_quantity,
      unit_code: item.unit_code,
      unit_name: item.unit_name,
      location_id: item.location_id ?? item.source_location_id,
      location_name: item.location_name ?? item.source_location_name,
    };

    onAdd(payload);
  };

  return (
    <div className="space-y-4">
      <div className="group w-full flex items-center gap-3 px-3 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={
              !error && item?.image_path
                ? `${item.image_path}`
                : "/placeholder-unit.png"
            }
            onError={() => setError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
            {item?.name}
          </p>

          <PrimaryBadge
            label={
              isLimited
                ? item?.available_quantity > 0
                  ? "Disponible"
                  : "No disponible"
                : "Disponible"
            }
            variant={
              isLimited
                ? item?.available_quantity > 0
                  ? "success"
                  : "danger"
                : "success"
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            Cantidad
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Unidad:{" "}
            <span className="font-semibold text-gray-600">
              {item?.unit_name} ({item?.unit_code})
            </span>
          </p>
        </div>
        <NumberSelector
          value={quantity}
          onDecrease={decreaseQty}
          onIncrease={increaseQty}
          min={0}
          max={isLimited ? item?.available_quantity : 2147483647}
        />
      </div>

      {isLimited && (
        <p className="text-xs text-gray-400 text-right">
          Disponible:{" "}
          <span className="font-semibold text-gray-600">
            {item?.available_quantity} {item?.unit_code}
          </span>
        </p>
      )}

      <div className="flex justify-end space-x-2 ">
        <button
          onClick={onClose}
          className="px-4 py-3 rounded-xl 
        text-black 
        disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleAdd}
          type="button"
          className="px-4 py-3 rounded-xl 
        bg-blue-500 text-white hover:bg-blue-400
        disabled:opacity-50 cursor-pointer"
        >
          {}
          {isEditing ? "Actualizar" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
