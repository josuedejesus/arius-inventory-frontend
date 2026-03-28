import { variant } from "@/constants/VariantEnum";

//make style for variant
const variantStyles: Record<variant, string> = {
  [variant.success]: "bg-green-600 hover:bg-green-500 text-white",
  [variant.warning]: "bg-yellow-500 hover:bg-yellow-400 text-black",
  [variant.info]: "bg-blue-500 hover:bg-blue-400 text-white",
  [variant.danger]: "bg-red-500 hover:bg-red-400 text-white",
  [variant.neutral]: "text-black",
  [variant.light]: "bg-gray-200 hover:bg-gray-100 text-black",
  [variant.dark]: "bg-gray-900 hover:bg-gray-800 text-white",
};

type Props = {
  label: string;
  icon?: React.ReactNode;
  variant: variant;
  onClick: () => void;
};

export default function Button({ label, icon, variant, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${variantStyles[variant]} px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
