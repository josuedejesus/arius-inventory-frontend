type FormDateProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
};

export default function FormDate({
  label,
  name,
  value,
  onChange,
  min,
}: FormDateProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>

      <input
        type="date"
        name={name}
        value={value}
        min={min}
        onChange={onChange}
        className="
          w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
        "
      />
    </div>
  );
}
