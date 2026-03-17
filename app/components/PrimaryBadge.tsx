interface PrimaryBadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "success" | "warning" | "info" | "danger" | "neutral";
  className?: string;
}

const variantStyles = {
  success: "bg-green-100 text-green-600 border border-green-200",
  warning: "bg-yellow-100 text-yellow-600 border border-yellow-200",
  info: "bg-blue-100 text-blue-600 border border-blue-200",
  danger: "bg-red-100 text-red-600 border border-red-200",
  neutral: "bg-gray-100 text-gray-600 border border-gray-200",
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
        text-[11px] font-medium
        px-2.5 py-0.5
        rounded-md
        whitespace-nowrap
        transition-colors
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {label}
    </span>
  );
}
