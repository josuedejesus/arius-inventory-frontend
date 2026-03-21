type FormLayoutProps = {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
  submitLabel?: string;
  children: React.ReactNode;
};

export function FormLayout({
  title,
  description,
  onSubmit,
  loading,
  error,
  submitLabel = "Guardar",
  children,
}: FormLayoutProps) {
  return (
    <form
      onSubmit={onSubmit}
      autoComplete=""
      className="space-y-2"
    >
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
          className="px-4 py-3 rounded-xl 
        bg-blue-500 text-white hover:bg-blue-400
        disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
