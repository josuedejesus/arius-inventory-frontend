"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../form/FormLayout";
import FormTabs from "../form/FormTabs";
import FormTabPanel from "../form/FormTabPanel";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import FormRadioGroup from "../form/FormRadioGroup";
import FormText from "../form/FormText";
import FormSwitch from "../form/FormSwitch";
import FormSelectSearch from "../form/FormSelectSearch";

type NewLocationFormProps = {
  onSuccess: () => void;
};

export default function NewLocationForm({ onSuccess }: NewLocationFormProps) {
  const [form, setForm] = useState({
    name: "",
    type: "WAREHOUSE",
    location: "",
    is_active: true,
    //extra
    location_members: [],
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");

  const [selectedTab, setSelectedTab] = useState<string>("general");

  const [selectedModule, setSelectedModule] = useState<any>();

  const [users, setUsers] = useState<any[]>([]);

  const [locationMembers, setLocationMembers] = useState<any[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/with-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data);
      setUsers(response.data);
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";

      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: form.name,
      type: form.type,
      location: form.location,
      is_active: form.is_active,
      //extra
      location_members: locationMembers,
    };

    console.log(payload);

    axios
      .post(`${apiUrl}/locations`, payload)
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

  const addMember = (accessory: any) => {
    setLocationMembers((prev) => {
      if (prev.some((a) => a.id === accessory.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: accessory.id,
          name: accessory.name,
        },
      ];
    });
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <FormLayout title="Crear Ubicacion" onSubmit={handleSubmit}>
      <FormTabs
        tabs={[
          { key: "general", label: "General" },
        ]}
        value={selectedTab}
        onChange={setSelectedTab}
      />

      <FormTabPanel when="general" value={selectedTab}>
        <FormSection
          title="Información general"
          description="Datos básicos de la ubicación"
        >
          <FormField
            label="Nombre"
            placeholder=""
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormRadioGroup
            label="Tipo de ubicación"
            options={[
              { value: "WAREHOUSE", label: "Bodega" },
              { value: "PROJECT", label: "Proyecto" },
              { value: "MAINTENANCE", label: "Mantenimiento" },
              { value: "VIRTUAL", label: "Virtual" },
            ]}
            name="type"
            value={form.type}
            onChange={handleChange}
          />
        </FormSection>

        <FormSection
          title="Detalles"
          description="Información adicional y estado"
        >
          <FormText
            label="Dirección / referencia"
            placeholder=""
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <FormSwitch
            label="Activo"
            name="is_active"
            value={form.is_active}
            onChange={handleChange}
          />
        </FormSection>
      </FormTabPanel>

      
    </FormLayout>
  );
}
