"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddedItemsContainer from "../../../components/AddedItemsContainer";
import { FormLayout } from "../../../components/form/FormLayout";
import FormTabs from "../../../components/form/FormTabs";
import FormTabPanel from "../../../components/form/FormTabPanel";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormText from "../../../components/form/FormText";
import FormSwitch from "../../../components/form/FormSwitch";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import { LocationViewModel } from "../types/location-view-model";
import { LocationType } from "../types/location-type.enum";
import { UpdateLocationDto } from "../types/update-location.dto";
import { CreateLocationDto } from "../types/create-location.dto";
import SavingScreen from "@/app/components/SavingScreen";

type Props = {
  locationId: number;
  onSuccess: () => void;
};

export default function LocationForm({ locationId, onSuccess }: Props) {
  const [form, setForm] = useState<LocationViewModel>({
    id: undefined,
    name: "",
    type: LocationType.WAREHOUSE,
    location: "",
    is_active: true,
    member_count: 0,
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<any[]>([]);

  const [locationMembers, setLocationMembers] = useState<any[]>([]);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (locationId) {
          setIsEdit(true);
          await Promise.all([
            handleGetLocation(),
            handlGetMembers(),
            handleGetUsers(),
          ]);
          return;
        }

        handleGetUsers();
      } catch (error: any) {
        toast.error(error?.message ?? "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [locationId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    console.log("is edit?", isEdit);

    if (isEdit) {
      handleUpdate();
      return;
    }

    handleCreate();
  };

  const handleCreate = async () => {
    const payload: CreateLocationDto = {
      name: form?.name,
      type: form?.type,
      location: form?.location,
      is_active: form?.is_active,
      //extra
      location_members: locationMembers,
    };
    console.log(payload);

    try {
      const response = await axios.post(`${apiUrl}/locations`, payload);
      onSuccess();
      toast.success("Ubicacion creada exitosamente");
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      console.log("finalizo");
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    const payload: UpdateLocationDto = {
      name: form?.name,
      type: form?.type,
      location: form?.location,
      is_active: form?.is_active,
      //extra
      location_members: locationMembers,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/locations/${locationId}`,
        payload,
      );
      onSuccess();
      toast.success("Ubicacion actualizada exitosamente");
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setSaving(false);
    }
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

  const handlGetMembers = () => {
    axios
      .get(`${apiUrl}/location-members/${locationId}`)
      .then((response) => {
        console.log(response.data.data);
        setLocationMembers(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.message);
        } else {
        }
      });
  };

  const handleGetLocation = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const locationData = response.data.data;
      console.log("DATOS DE UBICACION", locationData);
      setForm(locationData);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
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

  const removeMember = (id: number) => {
    setLocationMembers((prev) => prev.filter((a) => a.id !== id));
  };

  const skeleton = (
    <div className="p-4">
      <div className="h-6 w-1/3 bg-gray-300 rounded mb-4" />
      <div className="h-4 w-full bg-gray-300 rounded mb-2" />
      <div className="h-4 w-full bg-gray-300 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-2" />
    </div>
  );

  if (loading) {
    return skeleton;
  }

  return (
    <div className="relative">
      {saving && <SavingScreen />}
      <FormLayout title="" onSubmit={handleSubmit}>
        <FormTabs
          tabs={[
            { key: "general", label: "General" },
            { key: "staff", label: "Personal" },
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

        <FormTabPanel when="staff" value={selectedTab}>
          <FormSection
            title="Personal asignado"
            description="Personal que administrara el inventario de la ubicación"
          >
            <FormSelectSearch
              label="Personal"
              options={users}
              onSelect={addMember}
            />

            <AddedItemsContainer
              placeholder="personal"
              items={locationMembers}
              onRemove={removeMember}
            />
          </FormSection>
        </FormTabPanel>
      </FormLayout>
    </div>
  );
}
