type Option = {
  value: string;
  label: string;
};

type FormRadioGroupProps = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormRadioGroup({
  label,
  name,
  value,
  options,
  onChange,
}: FormRadioGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-1">
        {label}
      </label>

      <div className="flex flex-col gap-1">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all
                ${
                  isSelected
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
                }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                onChange={onChange}
                className="hidden"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                ${isSelected ? "border-blue-500" : "border-gray-300"}`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-sm">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
