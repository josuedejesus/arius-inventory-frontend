import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import FormTabs from "./form/FormTabs";
import FormTabPanel from "./form/FormTabPanel";
import FormSection from "./form/FormSection";
import { toast } from "sonner";
import ItemUnitCard from "../dashboard/items/cards/ItemUnitCard";
import NumberSelector from "./NumberSelector";
import SupplyCard from "./cards/SupplyCard";
import { RequisitionType } from "../dashboard/requisitions/types/requisition-type.enum";
import { PrimaryBadge } from "./badges/PrimaryBadge";

type AddSupplyFormProps = {
  itemId: number;
  requisitionType: RequisitionType | "";
  onAdd: (item: any) => void;
  onClose: () => void;
};

export default function AddSupplyForm({
  itemId,
  requisitionType,
  onAdd,
  onClose
}: AddSupplyFormProps) {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [accessories, setAccessories] = useState<any[]>([]);
  const [existingAccessories, setExistingAccessories] = useState<any[]>([]);

  const [item, setItem] = useState<any>(undefined);
  const [error, setError] = useState(false);
  const isLimited =
    requisitionType !== RequisitionType.ADJUSTMENT &&
    requisitionType !== RequisitionType.PURCHASE_RECEIPT;

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredItems = accessories.filter((u: any) =>
    `${u.name}`.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const [quantity, setQuantity] = useState<number>(0.0);

  const increaseQty = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    setQuantity(quantity - 1);
  };

  const handleGetItem = async () => {
    try {
      const response = await axios(`${apiUrl}/items/${itemId}/supply`);
      console.log("supply", response.data.data);
      setItem(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
      }
    }
  };

  const handleAdd = (item: any) => {
    if (quantity <= 0) {
      toast.warning("La cantidad debe ser mayor a 0");
      return;
    }
    const payload: any = {
      temp_id: Math.floor(Math.random() * 1000000), // Genera un ID temporal único
      item_id: Number(item.id),
      name: item.name,
      quantity: quantity,
      unit_code: item.unit_code,
      unit_name: item.unit_name,
    };

    onAdd(payload);
  };

  useEffect(() => {
    handleGetItem();
  }, []);

  return (
    <div className="space-y-4">
      <div className="group w-full flex items-center gap-3 px-3 py-3 hover:border-gray-300 hover:shadow-sm transition-all duration-150 text-left">
        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={
              !error && item?.image_path
                ? `${apiUrl}/uploads/${item.image_path}`
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
                  ? "Dispobile"
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
          onClick={() => handleAdd(item)}
          type="button"
          className="px-4 py-3 rounded-xl 
        bg-blue-500 text-white hover:bg-blue-400
        disabled:opacity-50 cursor-pointer"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
