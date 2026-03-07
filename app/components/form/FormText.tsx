type FormTextProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export default function FormText({
  label,
  name,
  value,
  placeholder,
  onChange,
}: FormTextProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
    w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
  "
      />
    </div>
  );
}
