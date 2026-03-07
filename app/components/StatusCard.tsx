import { formatDate } from "../utils/formatters";

type StatusCardProps = {
    title: string;
    label: string;
    date: string; 
    color: string;
}

export default function StatusCard({ title, label, date, color = "gray" }: StatusCardProps) {
  const colors: any = {
    gray: "bg-gray-400",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div className="w-[180px] bg-white rounded-md border shadow-sm overflow-hidden">
      <div className={`h-1 ${colors[color]}`} />

      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>
        <p className="text-xs text-gray-500">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-700">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}
