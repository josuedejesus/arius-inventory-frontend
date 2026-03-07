"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PHOTO_UPLOAD_ROLES = [
  "WAREHOUSE_MANAGER",
  "ADMIN",
  "OPERATION_MANAGER"
];

enum modes {
  VIEW,
  EDIT,
  APPROVE,
  EXECUTE,
  RECEIVE,
}

type RequisitionLinePhotosFormProps = {
  line: any;
  mode: modes;
  onSubmit: (files: File[]) => void;
  onClose: () => void;
};

export default function RequisitionLinePhotosForm({
  line,
  mode,
  onSubmit,
  onClose,
}: RequisitionLinePhotosFormProps) {
  const user = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<any[]>([]);

  const canUploadPhotos = useMemo(() => {
    if (!user.user) return false;

    return (
      mode === modes.EXECUTE && PHOTO_UPLOAD_ROLES.includes(user.user.user_role)
    );
  }, [user.user, mode]);

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    setFiles((prev) => [
      ...prev,
      ...Array.from(newFiles).filter((f) => f.type.startsWith("image/")),
    ]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!files.length) {
      toast.error("Debes agregar al menos una imagen.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(files);
      onClose();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleGetPhotos = async () => {
    axios
      .get(`${apiUrl}/requisition-line-photos/${line?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setPhotos(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  useEffect(() => {
    handleGetPhotos();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-base font-semibold text-gray-800">
          Evidencia del estado de salida
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {line.item_name}
          {line.internal_code && ` · ${line.internal_code}`}
        </p>
      </div>

      {/* FOTOS EXISTENTES */}
      <section>
        <p className="text-xs font-medium text-gray-400 mb-2 uppercase">
          Fotos registradas
        </p>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <img
                  src={`${apiUrl}/uploads/${photo.image_path}`}
                  alt="foto"
                  className="w-full h-28 object-contain bg-gray-100"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-600">No hay fotos registradas</p>
            <p className="text-xs text-gray-400 mt-1">
              Agrega al menos una imagen como evidencia
            </p>
          </div>
        )}
      </section>

      {/* UPLOAD */}
      {canUploadPhotos && (
        <section className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleAddFiles(e.target.files)}
            className="hidden"
            id="photo-upload"
          />

          <label
            htmlFor="photo-upload"
            className="cursor-pointer inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            + Agregar imágenes
          </label>

          <p className="text-xs text-gray-400 mt-1">
            Puedes subir múltiples fotos
          </p>
        </section>
      )}

      {/* PREVIEW NUEVAS */}
      {files.length > 0 && (
        <section>
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase">
            Nuevas fotos
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative group border rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-28 object-cover"
                />

                {/* Overlay hover */}
                <div
                  className="absolute inset-0 bg-black/40 opacity-0
                           group-hover:opacity-100 transition flex items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="bg-white text-red-600 text-xs px-3 py-1 rounded-md shadow"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACTIONS */}
      {canUploadPhotos && (
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
            className="
            bg-blue-600 text-white px-5 py-2 rounded-md text-sm
            hover:bg-blue-700 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          >
            {loading ? "Guardando..." : "Guardar fotos"}
          </button>
        </div>
      )}
    </div>
  );
}
