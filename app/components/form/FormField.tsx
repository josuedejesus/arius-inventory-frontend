import { useState } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
};

export default function FormField({
  label,
  name,
  value = "",
  placeholder,
  type = "text",
  onChange,
  maxLength,
}: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative">
      <input
        maxLength={maxLength}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={isFloating ? placeholder : ""}
        autoComplete="new-password"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full rounded-lg border px-3 pt-5 pb-2 text-sm text-gray-800
          focus:outline-none focus:ring-1 transition-colors
          ${focused ? "border-blue-500 focus:ring-blue-500" : "border-gray-300"}
        `}
      />
      <label
        className={`
          absolute left-3 transition-all duration-150 pointer-events-none
          ${
            isFloating
              ? "top-1.5 text-[10px] font-semibold tracking-wide"
              : "top-3.5 text-sm"
          }
          ${focused ? "text-blue-500" : "text-gray-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
}
