"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import ItemSelection from "../../../components/ItemSelections";
import { FormLayout } from "../../../components/form/FormLayout";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormText from "../../../components/form/FormText";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import { CreatePersonDto } from "../types/create-person.dto";
import { PersonRole } from "../types/person-role.enums";

type NewPersonFormProps = {
  onSuccess: () => void;
};

export default function NewPersonForm({ onSuccess }: NewPersonFormProps) {
  const [form, setForm] = useState<CreatePersonDto>({
    name: "",
    role: PersonRole.EMPLOYEE,
    email: "",
    phone: "",
    address: "",
    rtn: "",
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  //Modals
  const [showUsers, setShowUsers] = useState<boolean>(false);

  //Users
  const [users, setUsers] = useState<any[]>([]);

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
      name: form.name || "",
      role: form.role || "",
      email: form.email || "",
      phone: form.phone || "",
      address: form.address,
      rtn: form.rtn,
    };

    try {
      const response = await axios.post(`${apiUrl}/persons`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Persona creada exitosamente");
      onSuccess();
    } catch (error: any) {
      console.log(error.response);
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";

      setError(message);
      toast.error(message);
    }
  };

  const handleGetUsers = () => {
    axios
      .get(`${apiUrl}/users/get-available-users`)
      .then((response) => {
        console.log(response.data.data);
        setUsers(response.data.data);
      })
      .catch((error) => {})
      .finally(() => {});
  };

  const selectUser = (user: any) => {
    console.log(user);
    setForm((prev) => ({
      ...prev,
      user: user,
    }));

    setShowUsers(false);
  };

  useEffect(() => {
    console.log("los datos: ", form);
    handleGetUsers();
  }, []);

  return (
    <FormLayout
      title="Crear Persona"
      description="Ingrese los datos necesarios para crear un nuevo registro de persona."
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
      </FormSection>

      <FormSection title="Contacto" description="Datos de contacto">
        <FormField
          label="Correo"
          placeholder=""
          name="email"
          value={form.email ? form.email : ""}
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
  );
}
