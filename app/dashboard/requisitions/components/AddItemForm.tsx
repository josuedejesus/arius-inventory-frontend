import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../../components/SearchBar";
import FormTabs from "../../../components/form/FormTabs";
import FormTabPanel from "../../../components/form/FormTabPanel";
import FormSection from "../../../components/form/FormSection";
import { toast } from "sonner";
import ItemUnitCard from "../../items/cards/ItemUnitCard";
import NumberSelector from "../../../components/NumberSelector";
import EmptyList from "@/app/components/EmptyList";
import { MdInventory } from "react-icons/md";
import Button from "@/app/components/Button";
import { variant } from "@/constants/VariantEnum";

type Props = {
  itemUnit: any;
  addedAccessories: any[];
  onAdd: (item: any) => void;
};

export default function AddItemForm({
  itemUnit,
  addedAccessories,
  onAdd,
}: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [item, setItem] = useState<any>(undefined);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [existingAccessories, setExistingAccessories] = useState<any[]>([]);
  const [itemAccessories, setItemAccessories] =
    useState<any[]>(addedAccessories);
  const [searchValue, setSearchValue] = useState<string>("");
  
  const filteredItems = accessories.filter((u: any) =>
    `${u.name}`.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const setQty = (
    accessory: { id: number; accessory_id: number; name: string },
    value: number,
  ) => {
    setItemAccessories((prev) => {
      const existing = prev.find((a) => a.id === accessory.id);

      if (value <= 0) {
        return prev.filter((a) => a.id !== accessory.id);
      }

      if (existing) {
        return prev.map((a) =>
          a.id === accessory.id ? { ...a, quantity: value } : a,
        );
      }

      return [
        ...prev,
        {
          id: accessory.id,
          accessory_id: accessory.accessory_id,
          name: accessory.name,
          quantity: value,
        },
      ];
    });
  };

  const increaseQty = (accessory: {
    id: number;
    accessory_id: number;
    name: string;
  }) => {
    const current =
      itemAccessories.find((a) => a.id === accessory.id)?.quantity || 0;

    setQty(accessory, current + 1);
  };

  const decreaseQty = (accessory: {
    id: number;
    accessory_id: number;
    name: string;
  }) => {
    const current =
      itemAccessories.find((a) => a.id === accessory.id)?.quantity || 0;

    setQty(accessory, current - 1);
  };

  const getQty = (id: number) =>
    itemAccessories.find((a) => a.id === id)?.quantity || 0;

  const handleGetAccessories = async () => {
    try {
      const response = await axios(
        `${apiUrl}/item-accessories/${itemUnit?.item_id}/find-by-item`,
      );

      setAccessories(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
      }
    }
  };

  const handleGetExistingAccessories = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-rent-item-accessories/${itemUnit?.id}`,
      );
      setItemAccessories(response.data.data);
      setExistingAccessories(response.data.data);
    } catch (error: any) {}
  };

  const handleAdd = (item: any) => {
    console.log("item a agregar", item);
    const payload: any = {
      temp_id: Math.floor(Math.random() * 1000000), // Genera un ID temporal único
      item_id: Number(item?.item_id),
      name: item?.name,
      brand: item?.brand,
      model: item?.model,
      item_unit_id: item?.item_unit_id,
      internal_code: item?.internal_code,
      quantity: 1,
      unit_code: item?.unit_code,
      unit_name: item?.unit_name,
      image_path: item?.image_path,
      return_of_id: item?.return_of_id || null,
      accessories: itemAccessories,
      location_id: item?.location_id,
      location_name: item?.location_name,
    };

    onAdd(payload);
  };

  const handleGetItemByStatus = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/${itemUnit?.id}/get-by-status`,
      );
      console.log("item obtenido", response.data.data);
      setItem(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    }
  };

  useEffect(() => {
    Promise.all([
      handleGetItemByStatus(),
      handleGetAccessories(),
      handleGetExistingAccessories(),
    ]);
  }, []);

  return (
    <div className="space-y-2 gap-4">
      <ItemUnitCard itemUnit={item} onClick={() => console.log("testing")} />
      {existingAccessories.length > 0 ? (
        <FormSection
          title="Accesorios incluidos"
          description="Accesorios asociados a la requisición original"
        >
          <div className="space-y-2">
            {existingAccessories.map((a: any) => (
              <div
                key={a.accessory_id}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 border rounded-lg"
              >
                <span className="text-sm font-medium text-gray-800">
                  {a.name}
                </span>

                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                  {a.quantity}x
                </span>
              </div>
            ))}
          </div>
        </FormSection>
      ) : accessories.length > 0 && item?.status !== "RENTED" ? (
        <FormSection
          title="Accesorios"
          description="Selecciona los accesorios que deseas incluir"
        >
          <SearchBar
            placeholder="Buscar accesorio..."
            value={searchValue}
            onChange={setSearchValue}
          />

          <div className="space-y-3 mt-4">
            {filteredItems.map((i: any) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-4 p-4 border rounded-xl bg-white hover:shadow-sm transition"
              >
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {i.name}
                  </p>

                  {i.description && (
                    <p className="text-xs text-gray-500 truncate">
                      {i.description}
                    </p>
                  )}

                  {i.required && (
                    <span className="text-[11px] mt-1 w-fit px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                      Obligatorio
                    </span>
                  )}
                </div>

                <NumberSelector
                  value={getQty(i?.id)}
                  onDecrease={() => decreaseQty(i)}
                  onIncrease={() => increaseQty(i)}
                  min={0}
                  max={2147483647}
                />
              </div>
            ))}
          </div>
        </FormSection>
      ) : (
        <EmptyList icon={MdInventory} message="No hay accesorios disponibles para este artículo."/>
      )}

      <div className="flex justify-end mt-6 gap-3">
        <Button label="Agregar" variant={variant.success} onClick={() => handleAdd(item)} />
      </div>
    </div>
  );
}
