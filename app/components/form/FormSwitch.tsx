import { ChangeEvent } from "react";

type FormSwitchProps = {
  label: string;
  name: string;
  value: boolean;
  onChange: (e: ChangeEvent<any>) => void;
};

export default function FormSwitch({
  label,
  name,
  value,
  onChange,
}: FormSwitchProps) {
  const handleToggle = () => {
    onChange({
      target: {
        name,
        value: !value,
        type: "checkbox",
      },
    } as ChangeEvent<any>);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>

      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200
          ${value ? "bg-blue-500" : "bg-gray-300"}
        `}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white
            shadow transition-transform duration-200
            ${value ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
