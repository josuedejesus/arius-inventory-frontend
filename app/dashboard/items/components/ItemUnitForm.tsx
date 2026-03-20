"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../../../components/form/FormLayout";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormText from "../../../components/form/FormText";
import FormImageUpload from "../../../components/form/FormImageUpload";
import { ItemUnitViewModel } from "../types/item-unit-view.model";
import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { ItemViewModel } from "../types/item-view.model";
import SavingScreen from "@/app/components/SavingScreen";
import ItemCard from "../cards/ItemCard";

type Props = {
  item?: ItemViewModel;
  itemUnit?: ItemUnitViewModel;
  isParentEdit: boolean;
  onAccept: (itemUnid: any) => void;
  onSuccess: () => void;
};

export default function ItemUnitForm({
  item,
  itemUnit,
  isParentEdit,
  onAccept,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<any>({
    id: null,
    item_id: undefined,
    serial_number: "",
    internal_code: "",
    status: ItemUnitStatus.CREATED,
    condition: "NEW",
    location_id: null,
    description: "",
    observations: "",
    image_path: "",
    is_active: true,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [imageFile, setImageFile] = useState<any>(undefined);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isParentEdit) {
      if (itemUnit) {
        setIsEdit(true);
        setLoading(true);
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      if (isParentEdit) {
        if (isEdit) {
          await handleUpdateItemUnit();
        } else {
          await handleCreateItemUnit();
        }

        return;
      }

      onAccept(payload);
    } catch (err) {
      setError("Error saving item unit");
    } finally {
      setSaving(false);
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
    } finally {
      setLoading(false);
    }
  };

  const skelleton = (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-300 rounded"></div>
    </div>
  );

  if (loading) {
    return skelleton;
  }

  return (
    <>
      <div className="relative">
        {saving && <SavingScreen />}
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
            <ItemCard item={item} />
          </div>

          <FormSection
            title="Información general"
            description="Información general de la unidad del articulo"
          >
            <FormImageUpload
              label=""
              imagePath={form?.image_path}
              imageFile={imageFile}
              apiUrl={apiUrl!}
              onChange={setImageFile}
            />

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
      </div>
    </>
  );
}
