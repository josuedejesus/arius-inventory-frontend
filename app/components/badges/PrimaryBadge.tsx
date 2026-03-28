interface PrimaryBadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "success" | "warning" | "info" | "danger" | "neutral" | "light" | "dark";
  className?: string;
}

const variantStyles = {
  success: "bg-green-400 ",
  warning: "bg-yellow-400 ",
  info: "bg-blue-400",
  danger: "bg-red-400",
  neutral: "bg-gray-400",
  light: "bg-gray-200",
  dark: "bg-gray-800",
};

export function PrimaryBadge({
  label,
  icon,
  variant = "neutral",
  className = "",
}: PrimaryBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        text-[11px] font-bold text-white
        px-1.5 py-0.5
        rounded-md
        whitespace-nowrap
        transition-colors
        uppercase
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {label}
    </span>
  );
}
