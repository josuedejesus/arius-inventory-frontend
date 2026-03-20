"use client";

import FormField from "@/app/components/form/FormField";
import { FormLayout } from "@/app/components/form/FormLayout";
import FormSection from "@/app/components/form/FormSection";
import axios from "axios";
import { useEffect, useEffectEvent, useState } from "react";
import { toast } from "sonner";
import { CreateUnitDto } from "../types/create-unit.dto";
import { UpdateUnitDto } from "../types/update-units.dto";
import { UpdateItemDto } from "../../items/types/update-item.dto";
import { UnitViewModel } from "../types/unit-view.model";
import LoadingScreen from "@/app/components/LoadingScreen";
import SavingScreen from "@/app/components/SavingScreen";

type UnitFormProps = {
  unitId: number;
  onSuccess: () => void;
};

export default function UnitForm({ unitId, onSuccess }: UnitFormProps) {
  const [form, setForm] = useState<UnitViewModel>({
    id: null,
    name: "",
    code: "",
    description: "",
    is_active: true,
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetUnit = async () => {
    try {
      const response = await axios.get(`${apiUrl}/units/${unitId}`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: UpdateUnitDto | CreateUnitDto = {
      name: form.name,
      code: form.code,
      description: form.description,
      is_active: form.is_active,
    };

    if (isEdit) {
      handleUpdateUnit(payload);
    } else {
      handleCreateUnit(payload);
    }
  };

  const handleUpdateUnit = async (payload: UpdateItemDto | CreateUnitDto) => {
    try {
      const response = await axios.put(`${apiUrl}/units/${unitId}`, payload);
      toast.success(response.data.message);
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

  const handleCreateUnit = async (payload: CreateUnitDto) => {
    try {
      const response = await axios.post(`${apiUrl}/units/`, payload);
      toast.success(response.data.message);
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

  useEffect(() => {
    if (unitId) {
      setLoading(true);
      setIsEdit(true);
      handleGetUnit();
    }
  }, []);

  const skeleton = (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
    </div>
  );

  if (loading) {
    return skeleton;
  }

  return (
    <div className="relative">
      {saving && <SavingScreen />}
      <FormLayout title="" description="" onSubmit={handleSubmit}>
        {/* Datos personales */}
        <FormSection title="Informacion general" description="">
          <FormField
            label="Nombre"
            placeholder=""
            name="name"
            value={form?.name}
            onChange={handleChange}
          />
          <FormField
            label="Codigo"
            placeholder=""
            name="code"
            value={form?.code}
            onChange={handleChange}
          />
        </FormSection>
      </FormLayout>
    </div>
  );
}
