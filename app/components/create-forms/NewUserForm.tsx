"use client";

import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";
import Autocomplete from "../Autocomplete";
import { FormLayout } from "../form/FormLayout";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import FormRadioGroup from "../form/FormRadioGroup";
import FormSwitch from "../form/FormSwitch";

type NewUserFormProps = {
  onSuccess: () => void;
};

export default function NewUserForm({ onSuccess }: NewUserFormProps) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    is_active: true,
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");

  const [selectedTab, setSelectedTab] = useState<string>("general");

  const [selectedModule, setSelectedModule] = useState<any>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${apiUrl}/users`, form, {
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

        setError(message);
        toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout title="" description="" onSubmit={handleSubmit}>
      <FormSection
        title="Información del usuario"
        description="Datos básicos para el acceso al sistema"
      >
        <FormField
          label="Nombre"
          placeholder=""
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <FormField
          label="Usuario"
          placeholder=""
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <FormField
          label="Password"
          type="password"
          placeholder=""
          name="password"
          value={form.password}
          onChange={handleChange}
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
          value={form.role}
          onChange={handleChange}
        />
        <FormSwitch
          label="Activo"
          name="is_active"
          value={form.is_active}
          onChange={handleChange}
        />
      </FormSection>
    </FormLayout>
  );
}
