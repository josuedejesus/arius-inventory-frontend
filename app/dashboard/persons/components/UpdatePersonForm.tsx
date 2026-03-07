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
  person: Person;
  onSuccess: () => void;
};

export default function UpdatePersonForm({
  person,
  onSuccess,
}: NewPersonFormProps) {
  const [form, setForm] = useState<any>({
    name: person?.name,
    phone: person?.phone,
    email: person?.email,
    role: person?.role,
    address: person?.address || "",
    rtn: person?.rtn,
    user_id: person?.user_id,
    username: person?.username,
    user: {
      id: person?.user_id,
      name: person?.username,
    },
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Modals
  const [showUsers, setShowUsers] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  const [users, setUsers] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any>(undefined);

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
      name: form?.name,
      phone: form?.phone,
      email: form?.email,
      role: form?.role,
      address: form?.address || "",
      rtn: form?.rtn || "",
      user_id: form?.user_id,
    };

    console.log(payload);

    axios
      .put(`${apiUrl}/persons/${person?.id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users/available`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUsers(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
        toast.error(message);
    }
  };

  const selectUser = (user: any) => {
    console.log(user);
    setForm((prev: any) => ({
      ...prev,
      user_id: user.id,
      username: user.username,
      user: {
        id: user.id,
        name: user.username,
      },
    }));

    setShowUsers(false);
  };

  useEffect(() => {
    console.log("los datos: ", form);
    handleGetUsers();
  }, []);

  return (
    <>
      <FormLayout
        title="Actualizar Persona"
        description="Actualice la información de la persona y guarde los cambios realizados."
        onSubmit={handleSubmit}
      >
        <FormSection
          title="Información de la persona"
          description="Datos generales y de contacto"
        >
          <FormField
            label="Nombre"
            placeholder=""
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormText
            label="Direccion"
            placeholder=""
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <FormField
            label="RTN"
            placeholder=""
            name="rtn"
            value={form.rtn}
            onChange={handleChange}
          />

          <FormRadioGroup
            label="Rol"
            name="role"
            options={[
              { value: "EMPLOYEE", label: "Empleado" },
              { value: "CLIENT", label: "Externo" },
            ]}
            value={form.role}
            onChange={handleChange}
          />

          <FormSelectSearch
            label="Usuario Interno"
            value={form.user}
            options={users}
            onSelect={selectUser}
          />
        </FormSection>

        <FormSection title="Contacto" description="Datos de contacto">
          <FormField
            label="Correo"
            placeholder=""
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <FormField
            label="Teléfono "
            placeholder=""
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </FormSection>
      </FormLayout>
    </>
  );
}
