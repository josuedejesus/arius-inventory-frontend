"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { FormLayout } from "../form/FormLayout";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import FormRadioGroup from "../form/FormRadioGroup";
import FormSwitch from "../form/FormSwitch";

type User = {
  id: number;
  username: string;
  password: string | null;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
};

type NewUserFormProps = {
  user: User;
  onSuccess: () => void;
};

export default function UpdateUserForm({ user, onSuccess }: NewUserFormProps) {
  const [form, setForm] = useState({
    id: user?.id,
    name: user?.name,
    username: user?.username,
    password: "",
    role: user?.role,
    is_active: user?.is_active,
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //TAB
  const [selectedTab, setSelectedTab] = useState<string>("general");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await axios.patch(`${apiUrl}/users/${user.id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      toast.success("Usuario actualizado exitosamente");
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
    <FormLayout
      title="Actualizar Usuario"
      description=""
      onSubmit={handleSubmit}
    >
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
