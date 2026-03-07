import { useEffect } from "react";
import { FaX } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: ModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // evitar scroll fondo
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative z-10 w-full max-w-5xl
          bg-white rounded-md shadow-2xl
          max-h-[90vh] overflow-hidden
          animate-[fadeIn_.2s_ease-out]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              text-gray-400 hover:text-gray-600
              transition rounded-md p-1 
              hover:bg-gray-200
            "
          >
            <IoMdClose size={24}/>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}
