import clsx from "clsx";

type Props = {
  label: string;
  icon?: React.ReactNode;
  value: string | number;
  color?: string;
};


type Color =
  | "gray"
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange";

const colorStyles: Record<
  Color,
  { bg: string; text: string; value: string }
> = {
  gray: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    value: "text-gray-800",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    value: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-500",
    value: "text-green-600",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-500",
    value: "text-red-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-500",
    value: "text-yellow-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-500",
    value: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    value: "text-orange-600",
  },
};

export default function StatCard({
  label,
  value,
  icon,
  color = "gray",
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: Color;
}) {
  const styles = colorStyles[color];

  return (
    <div
      className={clsx(
        "rounded-xl p-4 flex flex-col gap-2 w-full",
        styles.bg
      )}
    >
      {/* Label */}
      <div className={clsx("text-sm font-medium flex items-center", styles.text)}>
        {icon && <span className="mr-2 text-base">{icon}</span>}
        {label}
      </div>

      {/* Value */}
      <div className={clsx("text-xl font-semibold tracking-tight", styles.value)}>
        {value}
      </div>
    </div>
  );
}
