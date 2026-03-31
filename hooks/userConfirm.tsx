import { useState } from "react";

type Variant = "danger" | "warning" | "info";

type ConfirmOptions = {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  variant?: Variant;
};

export const useConfirm = () => {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    onConfirm?: () => void | Promise<void>;
    variant: Variant;
    loading: boolean;
  }>({
    open: false,
    title: "",
    variant: "info",
    loading: false,
  });

  const confirm = ({
    title,
    description,
    onConfirm,
    variant = "info",
  }: ConfirmOptions) => {
    setState({
      open: true,
      title,
      description,
      onConfirm,
      variant,
      loading: false,
    });
  };

  const close = () => {
    setState((prev) => ({ ...prev, open: false, loading: false }));
  };

  const handleConfirm = async () => {
    if (!state.onConfirm) return;

    try {
      setState((prev) => ({ ...prev, loading: true }));
      await state.onConfirm();
      close();
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // 🎨 estilos por variant
  const styles = {
    danger: {
      button: "bg-red-500 hover:bg-red-500 text-white",
      title: "text-red-500",
    },
    warning: {
      button: "bg-yellow-500 hover:bg-yellow-400 text-black",
      title: "text-yellow-500",
    },
    info: {
      button: "bg-blue-500 hover:bg-blue-400 text-white",
      title: "text-blue-500",
    },
  };

  const ConfirmDialog = () => {
    if (!state.open) return null;

    const s = styles[state.variant];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <h2 className={`text-lg font-semibold ${s.title}`}>
            {state.title}
          </h2>

          {state.description && (
            <p className="text-sm text-gray-500 mt-2">
              {state.description}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={close}
              disabled={state.loading}
              className="px-4 py-2 text-gray-600 hover:text-black"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              disabled={state.loading}
              className={`px-4 py-2 rounded-lg ${s.button} ${
                state.loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {state.loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return {
    confirm,
    ConfirmDialog,
  };
};