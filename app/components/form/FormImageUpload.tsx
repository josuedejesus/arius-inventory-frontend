import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { MdEdit, MdNoPhotography } from "react-icons/md";

type Props = {
  label: string;
  imagePath?: string | null;
  imageFile?: File | null;
  apiUrl: string;
  onChange: (file: File | null) => void;
};

export default function FormImageUpload({
  label,
  imagePath,
  imageFile,
  apiUrl,
  onChange,
}: Props) {
  const [imgError, setImgError] = useState<boolean>(false);
  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : imagePath
      ? `${imagePath}`
      : null;
  useEffect(() => {
    setImgError(false);
  }, [imageFile, imagePath]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center gap-4">
        {previewUrl && !imgError ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt=""
              onError={() => setImgError(true)}
              className="w-32 h-32 object-cover rounded-lg"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0
        group-hover:opacity-100 transition
        flex items-center justify-center gap-2 rounded-lg"
            >
              <label
                className="cursor-pointer bg-white text-gray-700
          text-xs px-3 py-1 rounded shadow hover:bg-gray-100 flex items-center gap-1"
              >
                <MdEdit />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                />
              </label>

              <button
                type="button"
                onClick={() => onChange(null)}
                className="bg-red-500 text-white text-xs
          px-3 py-1 rounded shadow hover:bg-red-600 flex items-center gap-1"
              >
                <IoMdTrash />
              </button>
            </div>
          </div>
        ) : (
          <label
            className="w-32 h-32 flex flex-col items-center justify-center
      border-2 border-dashed rounded-lg cursor-pointer
      text-gray-400 hover:border-blue-400 hover:text-blue-500
      transition gap-1"
          >
            {/* ICON */}
            <MdNoPhotography className="text-3xl text-gray-300" />

            {/* TEXT */}
            <span className="text-sm">Sin imagen</span>
            <span className="text-xs">Subir PNG, JPG</span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onChange(e.target.files?.[0] || null)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
