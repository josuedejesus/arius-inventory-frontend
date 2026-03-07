"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import Autocomplete from "../../../components/Autocomplete";
import SearchBar from "../../../components/SearchBar";
import ItemSelection from "../../../components/ItemSelections";
import NewItemUnitForm from "../../../components/create-forms/NewItemUnitForm";
import ItemUnitCard from "../../../components/cards/ItemUnitCard";
import { FormLayout } from "../../../components/form/FormLayout";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormText from "../../../components/form/FormText";
import FormImageUpload from "../../../components/form/FormImageUpload";
import { ItemUnitViewModel } from "../types/item-unit-view.model";
import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { CreateItemDto } from "../types/create-item.dto";
import { ItemViewModel } from "../types/item-view.model";
import ItemCard from "./ItemCard";
import { format } from "path";
import { formatDate } from "@/app/utils/formatters";

type ItemUnitFormProps = {
  item?: ItemViewModel;
  itemUnit?: ItemUnitViewModel;
  isParentEdit: boolean;
  onAccept: (itemUnid: any) => void;
  onSuccess: () => void;
};

/*
id?: number;
  brand: string;
  name: string;
  created_at: string;
  is_active: boolean;
  minimum_stock: number;
  model: string;
  tracking: string;
  type: ItemType;
  unit_code: string;
  unit_id?: number;
  unit_name: string;
  updated_at: string;
  usage_hours: number;
*/

export default function ItemUnitForm({
  item,
  itemUnit,
  isParentEdit,
  onAccept,
  onSuccess,
}: ItemUnitFormProps) {
  const [form, setForm] = useState<any>({
    id: null,
    item_id: undefined,
    serial_number: "",
    internal_code: "",
    status: ItemUnitStatus.AVAILABLE,
    condition: "NEW",
    location_id: null,
    description: "",
    observations: "",
    image_path: "",
    is_active: true,
  });

  //const [item, setItem] = useState<ItemViewModel>();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Modals
  const [showUnits, setShowUnits] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  //Units
  const [units, setUnits] = useState<any[]>([]);

  const [imageFile, setImageFile] = useState<any>(undefined);

  //Accessories
  const [accessories, setAccessories] = useState<any[]>([]);
  const [itemAccessories, setItemAccessories] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any>(undefined);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      id: form?.id,
      item_id: form?.item_id,
      serial_number: form?.serial_number,
      internal_code: form?.internal_code,
      status: form?.status,
      condition: form?.condition,
      location_id: form?.location_id,
      description: form?.description,
      observations: form?.observations,
      is_active: form?.is_active,
    };

    const formData = new FormData();

    formData.append("id", form?.id);
    formData.append("item_id", form?.item_id);
    formData.append("serial_number", form?.serial_number);
    formData.append("internal_code", form?.internal_code);
    formData.append("status", form?.status);
    formData.append("condition", form?.condition);
    formData.append("location_id", form?.location_id);
    formData.append("description", form?.description);
    formData.append("observations", form?.observations);
    formData.append("is_active", String(form?.is_active));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    axios
      .post(`${apiUrl}/item-units/update-item-unit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        onSuccess();
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          setError(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
          toast.error(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      tempId: form.tempId ?? crypto.randomUUID(),
      id: form.id,
      item_id: form.item_id,
      serial_number: form.serial_number,
      internal_code: form.internal_code,
      status: form.status,
      condition: form.condition,
      location_id: form.location_id,
      description: form.description,
      observations: form.observations,
      image_path: form.image_path,
      is_active: form.is_active,
      image_file: imageFile,
    };

    try {
      // 🔹 Si el padre ya existe → guardar directo en DB
      if (isParentEdit) {
        if (isEdit) {
          await handleUpdateItemUnit();
        } else {
          await handleCreateItemUnit();
        }

        return;
      }

      // 🔹 Si el padre es nuevo → manejar lista temporal
      onAccept(payload);
    } catch (err) {
      setError("Error saving item unit");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItemUnit = async () => {
    try {
      const formData = new FormData();

      formData.append("item_id", String(item?.id) || "");
      formData.append("serial_number", form.serial_number || "");
      formData.append("internal_code", form.internal_code || "");
      formData.append("status", form.status || "");
      formData.append("condition", form.condition || "");
      formData.append("description", form.description || "");
      formData.append("observations", form.observations || "");
      formData.append("is_active", form.is_active || "");

      console.log(formData.get("item_id"));

      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await axios.post(`${apiUrl}/item-units`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleUpdateItemUnit = async () => {
    try {
      const payload: any = {
        id: form.id,
        item_id: form.item_id,
        serial_number: form.serial_number,
        internal_code: form.internal_code,
        status: form.status,
        condition: form.condition,
        location_id: form.location_id,
        description: form.description,
        observations: form.observations,
        image_path: form.image_path,
        is_active: form.is_active,
      };

      const formData = new FormData();

      formData.append("id", form.id);
      formData.append("item_id", form.item_id || "");
      formData.append("serial_number", form.serial_number || "");
      formData.append("internal_code", form.internal_code || "");
      formData.append("status", form.status || "");
      formData.append("condition", form.condition || "");
      formData.append("description", form.description || "");
      formData.append("observations", form.observations || "");
      formData.append("is_active", form.is_active || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await axios.put(
        `${apiUrl}/item-units/${itemUnit?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data.message);
      onSuccess();
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetItemUnit = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/${itemUnit?.id}`);
      setForm(response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";

      toast.error(message);
    }
  };

  useEffect(() => {
    if (isParentEdit) {
      if (itemUnit) {
        setIsEdit(true);
        handleGetItemUnit();
      } else {
      }
    } else {
      if (itemUnit) {
        setIsEdit(true);

        setForm(itemUnit);
      } else {
      }
    }

    //handleGetAccessories();
    //handleGetItemAccessories(item?.id);
  }, []);

  return (
    <>
      <FormLayout title="" description="" onSubmit={handleSubmit}>
        {/* Tabs / Sections */}
        <div className="border-b flex gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setSelectedTab("general")}
            className={`pb-2 border-b-2 ${
              selectedTab === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            General
          </button>
        </div>

        <div className="flex">
          <FormImageUpload
            label=""
            imagePath={form?.image_path}
            imageFile={imageFile}
            apiUrl={apiUrl!}
            onChange={setImageFile}
          />
          <div className="bg-white px-4 py-3 space-y-1">
            {/* Marca */}
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {item?.brand}
            </p>

            {/* Nombre */}
            <p className="text-base font-semibold text-gray-800">
              {item?.name}
            </p>

            {/* Modelo */}
            <p className="text-sm text-gray-600">
              Modelo: <span className="font-medium">{item?.model}</span>
            </p>
          </div>
        </div>

        <FormSection
          title="Información general"
          description="Información general de la unidad del articulo"
        >
          <FormField
            label="Codigo"
            name="internal_code"
            placeholder=""
            value={form?.internal_code}
            onChange={handleChange}
          />

          <FormRadioGroup
            label="Estado"
            name="condition"
            value={form?.condition}
            options={[
              { value: "NEW", label: "Nuevo" },
              { value: "GOOD", label: "Bueno" },
              { value: "FAIR", label: "Regular" },
              { value: "DAMAGED", label: "Danado" },
            ]}
            onChange={handleChange}
          />

          <FormText
            label="Descripcion"
            name="description"
            placeholder=""
            value={form?.description}
            onChange={handleChange}
          />

          <FormText
            label="Observaciones"
            name="observations"
            placeholder=""
            value={form?.observations}
            onChange={handleChange}
          />
        </FormSection>
      </FormLayout>
    </>
  );
}
