"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../form/FormLayout";
import FormTabs from "../form/FormTabs";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import FormRadioGroup from "../form/FormRadioGroup";
import FormText from "../form/FormText";
import FormSwitch from "../form/FormSwitch";
import FormImageUpload from "../form/FormImageUpload";

type ItemUnit = {
  item_id: string;
  serial_number: string;
  internal_code: string;
  status: string;
  condition: string;
  description: string;
  observations: string;
  is_active: boolean;
  image_path: string;
};

type NewItemUnitFormProps = {
  itemId: string;
  onSuccess: () => void;
};

export default function NewItemUnitForm({
  itemId,
  onSuccess,
}: NewItemUnitFormProps) {
  const [form, setForm] = useState<ItemUnit>({
    item_id: itemId,
    serial_number: "",
    internal_code: "",
    status: "AVAILABLE",
    condition: "",
    description: "",
    observations: "",
    is_active: true,
    image_path: "",
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  //Modals
  const [showUnits, setShowUnits] = useState<boolean>(false);

  //Units
  const [units, setUnits] = useState<any[]>([]);

  //Accessories
  const [accessories, setAcccessories] = useState<any[]>([]);

  //Item Accessories
  const [itemAccessories, setItemAccessories] = useState<any[]>([]);


  //Image
  const [imageFile, setImageFile] = useState<any>(undefined);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      item_id: form.item_id,
      serial_number: form.serial_number || "",
      internal_code: form.internal_code,
      status: form.status,
      condition: form.condition,
      description: form.description,
      observations: form.observations,
      is_active: form.is_active,
    };

    console.log(payload);

    axios
      .post(`${apiUrl}/item-units`, payload)
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
  };

  const handleGetAccessories = () => {
    axios
      .get(`${apiUrl}/accessories`)
      .then((response) => {
        setAcccessories(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
        }
      });
  };

  const handleGetUnits = () => {
    axios
      .get(`${apiUrl}/units`)
      .then((response) => {
        console.log(response.data.data);
        setUnits(response.data.data);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  const selectUnit = (unit: any) => {
    console.log(unit);
    setForm((prev) => ({
      ...prev,
      unit: unit,
    }));

    setShowUnits(false);
  };

  const removeAccessory = (id: number) => {
    setItemAccessories((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    handleGetUnits();
    handleGetAccessories();
  }, []);

  const handleCreateAccessory = (accessory: any) => {
    setLoading(true);
    setError(null);

    const payload = {
      name: accessory,
      is_active: true,
    };

    axios
      .post(`${apiUrl}/accessories`, payload)
      .then((response) => {
        toast.success(response.data.message);
        //onSuccess();
        handleGetAccessories();
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
  };

  return (
    <FormLayout title="" description="" onSubmit={handleSubmit}>
      <FormTabs
        value={selectedTab}
        tabs={[{ key: "general", label: "General" }]}
        onChange={setSelectedTab}
      />

      <div className="mt-6 ">
        {selectedTab === "general" && (
          <div>
            <FormSection
              title="Nueva Unidad"
              description="Creacion de unidad de articulo"
            >
              <FormField
                label="Codigo"
                placeholder=""
                name="internal_code"
                value={form.internal_code}
                onChange={handleChange}
              />

              <FormField
                label="Numero de Serie"
                placeholder=""
                name="serial_number"
                value={form.serial_number}
                onChange={handleChange}
              />

              <FormRadioGroup
                label="Condicion"
                name="condition"
                value={form.condition}
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
                placeholder=""
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <FormText
                label="Observaciones"
                placeholder=""
                name="observations"
                value={form.observations}
                onChange={handleChange}
              />

              <FormImageUpload
                label="Imagen"
                imagePath={form.image_path}
                imageFile={imageFile}
                apiUrl={apiUrl!}
                onChange={setImageFile}
              />
            </FormSection>
          </div>
        )}
      </div>
    </FormLayout>
  );
}
