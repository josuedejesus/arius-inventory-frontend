type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormField({
  label,
  name,
  value = "",
  placeholder,
  type = "text",
  onChange,
}: FormFieldProps) {
  return (
    <div className="">
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password"
        className="
    w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
  "
      />
    </div>
  );
}
