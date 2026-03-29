import { useEffect, useRef, useState } from "react";

type ItemPercentageCardProps = {
  label: string;
  stock: number;
  total: number;
  color?: string
};

export default function PercentageCard({
  label,
  stock,
  total,
  color,

}: ItemPercentageCardProps) {
  const ratio = total > 0 ? stock / total : 0;
  const percentage = Math.min(Math.max(ratio * 100, 0), 100);

  const prevPercentage = useRef(percentage);
  const [width, setWidth] = useState(percentage);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (percentage !== prevPercentage.current) {
      setDirection(percentage > prevPercentage.current ? "up" : "down");
      setWidth(percentage);
      prevPercentage.current = percentage;

      const timer = setTimeout(() => setDirection(null), 600);
      return () => clearTimeout(timer);
    }
  }, [percentage]);

  let barColor = color ? `bg-${color}-500` : "bg-green-500";
  let textColor = color ? `text-${color}-500` : "text-green-500";

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${barColor} h-full rounded-full transition-all duration-500`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {direction && (
            <span
              className={`text-[9px] ${
                direction === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {direction === "up" ? "▲" : "▼"}
            </span>
          )}
          <span className={`text-[10px] font-medium ${textColor}`}>
            {stock} / {total} {label ? label : ""}
          </span>
        </div>

        {/* 🔥 porcentaje */}
        <span className="text-[10px] font-semibold text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
