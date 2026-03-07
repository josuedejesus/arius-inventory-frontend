import { ReactNode } from "react";

type ActionButtonProps = {
  label: string;
  icon?: ReactNode;
  color?: string;
  onClick: () => void;
};

export default function ActionButton({
  label,
  icon,
  color = "text-blue-600 bg-blue-50 hover:bg-blue-100",
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`
    flex items-center gap-2
    px-3 py-1.5
    text-sm font-medium
    ${color}
    rounded-md
    transition
    cursor-pointer
  `}
    >
      {icon}
      {label}
    </button>
  );
}
