import { ChangeEvent } from "react";

type FormRadioGroupProps = {
  label: string;
  name: string;
  options: any[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function FormRadioGroup({
  label,
  name,
  options,
  value,
  onChange,
}: FormRadioGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>

      <div className="flex flex-wrap gap-3">
        {options.map((t) => (
          <label
            key={t.value}
            className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer
              ${
                value === t.value
                  ? "bg-blue-50 border-blue-400 text-blue-600"
                  : "text-gray-600 hover:border-gray-300"
              }`}
          >
            <input
              type="radio"
              name={name}
              value={t.value}
              checked={value === t.value}
              onChange={onChange}
              className="hidden"
            />
            {t.label}
          </label>
        ))}
      </div>
    </div>
  );
}
