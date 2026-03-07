"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

type NewUnitFormProps = {
  onSuccess: () => void;
};

export default function NewUnitForm({ onSuccess }: NewUnitFormProps) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true,
  });

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios
      .post(`${apiUrl}/units`, form)
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
            "El servidor no está disponible en este momento. Intente más tarde."
          );
          toast.error(
            "El servidor no está disponible en este momento. Intente más tarde."
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className="space-y-6 text-gray-800"
    >
      {/* Datos personales */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          General
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Codigo
            </label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-400 text-white py-2.5 rounded-lg
               hover:bg-blue-500 transition font-medium
               disabled:opacity-50"
      >
        {loading ? "Creando unidad..." : "Crear unidad"}
      </button>
    </form>
  );
}
