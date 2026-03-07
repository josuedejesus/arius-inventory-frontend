"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../../../components/form/FormLayout";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormText from "../../../components/form/FormText";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import { PersonRole } from "../types/person-role.enums";
import FormTabs from "@/app/components/form/FormTabs";
import FormTabPanel from "@/app/components/form/FormTabPanel";
import FormSwitch from "@/app/components/form/FormSwitch";
import { PersonViewModel } from "../types/person-view-model";
import { UserViewModel } from "../types/user-view-model";
import { UserRole } from "../types/user-role.enum";
import { CreatePersonDto } from "../types/create-person.dto";
import { CreateUserDto } from "../types/create-user.dto";

type Person = {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: PersonRole;
  address: string;
  rtn: string;
  user_id: number;
  username: string;
  //
  user: {
    id: string;
    name: string;
  };
};

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

  const [person, setPerson] = useState<Person>();

  //Modals
  const [showUsers, setShowUsers] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isEditing) {
      handleEdit();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    try {
      const personPayload: CreatePersonDto = {
        name: form?.name,
        phone: form?.phone,
        email: form?.email,
        role: form?.role,
        address: form?.address || "",
        rtn: form?.rtn || "",
        user: {
          username: userForm?.username,
          password: userForm?.password || "",
          role: userForm?.role,
          is_active: userForm?.is_active,
        },
      };

      const response = await axios.post(
        `${apiUrl}/persons`,
        personPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      toast.success('Usuario creado exitosamente');
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        name: form?.name,
        phone: form?.phone,
        email: form?.email,
        role: form?.role,
        address: form?.address || "",
        rtn: form?.rtn || "",
      };

      console.log("person id", person?.id);

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
    }
  };

  const handleGetPerson = async () => {
    try {
      const response = await axios.get(`${apiUrl}/persons/${personId}`);
      setForm(response.data.data);
      console.log("persona: ", response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/${personId}/person`);
      console.log("user", response.data);
      setUserForm(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (personId) {
      setIsEditing(true);
      Promise.all([handleGetPerson(), handleGetUser()]);
    }
  }, []);

  return (
    <>
      <FormLayout
        title=""
        description="Actualice la información de la persona y guarde los cambios realizados."
        onSubmit={handleSubmit}
      >
        <FormTabs
          tabs={[
            { key: "general", label: "General" },
            { key: "user", label: "Usuario" },
          ]}
          value={selectedTab}
          onChange={setSelectedTab}
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
              value={form?.rtn}
              onChange={handleChange}
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
              value={form?.phone}
              onChange={handleChange}
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
              label="Password"
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
      </FormLayout>
    </>
  );
}
