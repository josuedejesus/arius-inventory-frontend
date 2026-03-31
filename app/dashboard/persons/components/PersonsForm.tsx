"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../../../components/form/FormLayout";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormText from "../../../components/form/FormText";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import { PersonRole } from "../types/person-role.enums";
import FormTabs from "@/app/components/form/FormTabs";
import FormTabPanel from "@/app/components/form/FormTabPanel";
import FormSwitch from "@/app/components/form/FormSwitch";
import { PersonViewModel } from "../types/person-view-model";
import { UserViewModel } from "../types/user-view-model";
import { UserRole } from "../types/user-role.enum";
import { CreatePersonDto } from "../types/create-person.dto";
import { set } from "date-fns";
import SavingScreen from "@/app/components/SavingScreen";
import { formatHNPhone, unformatPhone } from "@/app/utils/phone";
import FormSelectSearch from "@/app/components/form/FormSelectSearch";
import AddedItemsContainer from "@/app/components/AddedItemsContainer";
import { LocationViewModel } from "../../locations/types/location-view-model";
import { formatHNRTN, unformatRTN } from "@/app/utils/rtn";

type NewPersonFormProps = {
  personId?: number;
  onSuccess: () => void;
};

export default function PersonsForm({
  personId,
  onSuccess,
}: NewPersonFormProps) {
  const [form, setForm] = useState<PersonViewModel>({
    id: undefined,
    name: "",
    phone: "",
    email: "",
    role: PersonRole.EMPLOYEE,
    address: "",
    rtn: "",
    //user
    user_id: undefined,
    username: "",
    //locations
    location_count: 0,
  });

  const [userForm, setUserForm] = useState<UserViewModel>({
    id: undefined,
    username: "",
    password: "",
    role: UserRole.ADMIN,
    is_active: true,
    person_id: undefined,
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);

  useEffect(() => {
    if (personId) {
      setIsEditing(true);
      setLoading(true);
      const fetchData = async () => {
        try {
          await Promise.all([handleGetPerson(), handleGetUser()]);
        } catch (error) {
          toast.error(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
    handleGetLocations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeUser = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  const addLocation = (accessory: any) => {
    setUserLocations((prev) => {
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

  const removeLocation = (id: number) => {
    setUserLocations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);

      const locationsPayload = userLocations.map((l: any) => l.id);

      const personPayload: CreatePersonDto = {
        name: form?.name,
        phone: unformatPhone(form?.phone),
        email: form?.email,
        role: form?.role,
        address: form?.address || "",
        rtn: unformatRTN(form?.rtn || ""),
        user: {
          username: userForm?.username,
          password: userForm?.password || "",
          role: userForm?.role,
          is_active: userForm?.is_active,
        },
        locations: locationsPayload,
      };
      
      console.log(personPayload);

      const response = await axios.post(`${apiUrl}/persons`, personPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Usuario creado exitosamente");
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const locationsPayload = userLocations.map((l: any) => l.id);

      const payload = {
        name: form?.name,
        phone: unformatPhone(form?.phone),
        email: form?.email,
        role: form?.role,
        address: form?.address || "",
        rtn: unformatRTN(form?.rtn || ""),
        user: {
          username: userForm?.username,
          password: userForm?.password || "",
          role: userForm?.role,
          is_active: userForm?.is_active,
        },
        locations: locationsPayload,
      };

      const response = await axios.put(
        `${apiUrl}/persons/${form?.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    } finally {
      setSaving(false);
    }
  };

  const handleGetPerson = async () => {
    try {
      const response = await axios.get(`${apiUrl}/persons/${personId}`);
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

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${personId}/person`);
      handleGetUserLocations(response.data.id);
      setUserForm(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetLocations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setLocations(response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data.message ?? "Error obteniendo ubicaciones";
      toast.error(message);
    }
  };

  const handleGetUserLocations = async (userId: number | string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/locations/${userId}/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setUserLocations(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data.message ??
        "Error obteniendo ubicaciones de usuario";
      toast.error(message);
    }
  };

  const skeleton = (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-300 rounded w-1/3" />
      <div className="h-6 bg-gray-300 rounded w-full" />
      <div className="h-6 bg-gray-300 rounded w-full" />
      <div className="h-6 bg-gray-300 rounded w-full" />
      <div className="h-6 bg-gray-300 rounded w-full" />
      <div className="h-6 bg-gray-300 rounded w-full" />
    </div>
  );

  if (loading) {
    return skeleton;
  }

  return (
    <>
      <div className="relative">
        {saving && <SavingScreen />}
        <FormLayout
          title=""
          description="Actualice la información de la persona y guarde los cambios realizados."
          onSubmit={handleSubmit}
        >
          <FormTabs
            tabs={[
              { key: "general", label: "General" },
              { key: "user", label: "Usuario" },
              { key: "locations", label: "Ubicaciones" },
            ]}
            value={selectedTab}
            onChange={(e: any) => {
              setSelectedTab(e);
              
            }}
          />
          <FormTabPanel when="general" value={selectedTab}>
            <FormSection
              title="Información de la persona"
              description="Datos generales y de contacto"
            >
              <FormField
                label="Nombre"
                placeholder=""
                name="name"
                value={form?.name}
                onChange={handleChange}
              />

              <FormText
                label="Direccion"
                placeholder=""
                name="address"
                value={form?.address}
                onChange={handleChange}
              />

              <FormField
                label="RTN"
                placeholder=""
                name="rtn"
                value={formatHNRTN(form?.rtn)}
                onChange={handleChange}
                maxLength={16}
              />

              <FormRadioGroup
                label="Rol"
                name="role"
                options={[
                  { value: "EMPLOYEE", label: "Empleado" },
                  { value: "CLIENT", label: "Externo" },
                ]}
                value={form?.role}
                onChange={handleChange}
              />
            </FormSection>

            <FormSection title="Contacto" description="Datos de contacto">
              <FormField
                label="Correo"
                placeholder=""
                name="email"
                value={form?.email}
                onChange={handleChange}
              />

              <FormField
                label="Teléfono "
                placeholder=""
                name="phone"
                value={formatHNPhone(form?.phone || "")}
                onChange={handleChange}
                maxLength={9}
              />
            </FormSection>
          </FormTabPanel>

          <FormTabPanel when="user" value={selectedTab}>
            <FormSection
              title="Información del usuario"
              description="Datos básicos para el acceso al sistema"
            >
              <FormField
                label="Usuario"
                placeholder=""
                name="username"
                value={userForm?.username}
                onChange={handleChangeUser}
              />

              <FormField
                label="Contraseña"
                type="password"
                placeholder=""
                name="password"
                value={userForm.password || ""}
                onChange={handleChangeUser}
              />
            </FormSection>

            <FormSection
              title="Permisos y rol"
              description="Define el nivel de acceso del usuario"
            >
              <FormRadioGroup
                label="Tipo de usuario"
                options={[
                  { value: "ADMIN", label: "Administrador del sistema" },
                  {
                    value: "ADMINISTRATIVE_MANAGER",
                    label: "Administrador operativo",
                  },
                  { value: "WAREHOUSE_MANAGER", label: "Encargado de bodega" },
                  { value: "CONTRACTOR", label: "Contratista" },
                  { value: "CLIENT", label: "Cliente" },
                ]}
                name="role"
                value={userForm?.role}
                onChange={handleChangeUser}
              />

              <FormSwitch
                label="Activo"
                name="is_active"
                value={userForm?.is_active}
                onChange={handleChangeUser}
              />
            </FormSection>
          </FormTabPanel>

          <FormTabPanel when="locations" value={selectedTab}>
            <FormSection
              title="Ubicaciones asignadas"
              description="Ubicaciones a las que esta persona tiene acceso para administrar el inventario"
            >
              <FormSelectSearch
                label="Ubicaciones"
                options={locations}
                onSelect={addLocation}
              />

              <AddedItemsContainer
                placeholder="ubicaciones"
                items={userLocations}
                onRemove={removeLocation}
              />
            </FormSection>
          </FormTabPanel>
        </FormLayout>
      </div>
    </>
  );
}
