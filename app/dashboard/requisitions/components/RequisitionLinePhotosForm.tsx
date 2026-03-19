"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  MdArrowRightAlt,
  MdInventory,
  MdNoPhotography,
  MdPhotoCamera,
} from "react-icons/md";
import { toast } from "sonner";

const PHOTO_UPLOAD_ROLES = ["WAREHOUSE_MANAGER", "ADMIN", "OPERATION_MANAGER"];

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
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RequisitionLinePhotosForm({
  line,
  mode,
  onClose,
  onSuccess,
}: RequisitionLinePhotosFormProps) {
  const user = useAuth();

  console.log("line in form", line);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [photos, setPhotos] = useState<any[]>([]);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const handleUpdloadPhotos = async () => {
    try {
      const formData = new FormData();

      formData.append("requisition_line_id", line?.id);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        `${apiUrl}/requisition-line-photos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      toast.success("Fotos subidas exitosamente");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Error subiendo las fotos");
    }
  };

  useEffect(() => {
    handleGetPhotos();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        {/* ITEM CARD */}
        <div className="flex items-start gap-3 bg-gray-50 border rounded-lg p-3">
          {/* ICON */}
          <div className="w-10 h-10 bg-white border rounded flex items-center justify-center">
            <MdInventory className="text-gray-400 text-xl" />
          </div>

          {/* INFO */}
          <div className="flex flex-col flex-1 text-sm">
            {/* NAME */}
            <span className="font-semibold text-gray-800">
              {line.item_name}
            </span>

            {/* BRAND + MODEL */}
            <span className="text-xs text-gray-500">
              {line.item_brand} · {line.item_model}
            </span>

            {/* CODE */}
            <span className="text-xs text-gray-400">
              Código: {line.internal_code}
            </span>
          </div>
        </div>
      </div>

      {/* FOTOS EXISTENTES */}
      <section className="space-y-3">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Fotos registradas
          </p>

          <span className="text-xs text-gray-400">
            {photos.length} {photos.length === 1 ? "imagen" : "imágenes"}
          </span>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() =>
                  setSelectedPhoto(`${apiUrl}/uploads/${photo.image_path}`)
                }
                className="group relative border rounded-xl overflow-hidden bg-gray-100 hover:shadow-md transition"
              >
                <img
                  src={`${apiUrl}/uploads/${photo.image_path}`}
                  alt="foto"
                  className="w-full h-28 object-contain transition-transform duration-200 group-hover:scale-105"
                />

                {/* OVERLAY HOVER */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-white text-xs">Ver</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <MdNoPhotography className="text-gray-400 text-lg" />
            </div>

            <p className="text-sm text-gray-600 font-medium">
              No hay fotos registradas
            </p>

            <p className="text-xs text-gray-400">
              Agrega imágenes como evidencia del estado del ítem
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
            onClick={handleUpdloadPhotos}
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full px-4">
            <img
              src={selectedPhoto}
              alt="preview"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 text-gray-800 bg-white/90 rounded-full px-2 py-1 text-sm hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
