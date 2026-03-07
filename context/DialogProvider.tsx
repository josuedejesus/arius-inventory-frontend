// context/DialogContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DialogOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void | Promise<void>;
};

type DialogContextType = {
  open: (options: DialogOptions) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const open = (options: DialogOptions) => setDialog(options);
  const close = () => setDialog(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await dialog?.onConfirm();
      close();
    } catch (e) {
      close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContext.Provider value={{ open }}>
      {children}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={close} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-800">{dialog.title}</h3>
              {dialog.description && (
                <p className="text-sm text-gray-500 mt-1">{dialog.description}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={close}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {dialog.cancelLabel ?? "Cancelar"}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50
                  ${dialog.variant === "danger"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                {loading ? "..." : (dialog.confirmLabel ?? "Confirmar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}