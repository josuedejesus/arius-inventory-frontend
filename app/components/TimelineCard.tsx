import { format } from "date-fns";
import { es } from "date-fns/locale";

type TimelineCardProps = {
  title: string;
  date?: string | Date | null;
  user?: string | null;
  color?: "gray" | "blue" | "green" | "yellow" | "red";
};

const colorMap = {
  gray:   { dot: "bg-gray-400",     bg: "bg-gray-50",     border: "border-gray-200", text: "text-gray-500"  },
  blue:   { dot: "bg-blue-500",     bg: "bg-blue-50",     border: "border-blue-200", text: "text-blue-600"  },
  green:  { dot: "bg-emerald-500",  bg: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-600" },
  yellow: { dot: "bg-amber-400",    bg: "bg-amber-50",    border: "border-amber-200", text: "text-amber-600" },
  red:    { dot: "bg-red-500",      bg: "bg-red-50",      border: "border-red-200",  text: "text-red-600"   },
};

export default function TimelineCard({
  title,
  date,
  user,
  color = "gray",
}: TimelineCardProps) {
  const c = colorMap[color];

  const formatted = date
    ? format(new Date(date), "d MMM yyyy, HH:mm", { locale: es })
    : null;

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} px-4 py-3 flex flex-col gap-1.5`}>
      {/* Top: dot + title */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wide ${c.text}`}>
          {title}
        </span>
      </div>

      {/* Date */}
      {formatted ? (
        <p className="text-sm font-semibold text-gray-800 leading-tight">{formatted}</p>
      ) : (
        <p className="text-sm text-gray-300">Pendiente</p>
      )}

      {/* User */}
      {user && (
        <p className="text-xs text-gray-400 truncate">{user}</p>
      )}
    </div>
  );
}