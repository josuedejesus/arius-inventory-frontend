type FormLayoutProps = {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
  submitingLabel?: string;
  children: React.ReactNode;
  buttonWidth?: string;
  buttonClassName?: string;
};

export function FormLayout({
  title,
  description,
  onSubmit,
  loading,
  error,
  submitLabel = "Guardar",
  submitingLabel = "Guardando...",
  children,
  buttonWidth = "w-auto",
  buttonClassName = "",
}: FormLayoutProps) {
  return (
    <form onSubmit={onSubmit} autoComplete="" className="space-y-2">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      {children}

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700
        text-sm p-3 rounded"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 ">
        {/*<button
          className="px-4 py-3 rounded-xl 
        text-black 
        disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>*/}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-3 rounded-md w-${buttonWidth}
        bg-blue-500 text-white hover:bg-blue-400
        disabled:opacity-50 cursor-pointer ${buttonClassName}`}
        >
          {loading ? submitingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
