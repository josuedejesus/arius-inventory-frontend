import { useEffect, useRef, useState } from "react";

type ItemPercentageCardProps = {
  item: any;
};

export default function ItemPercentageCard({ item }: ItemPercentageCardProps) {
  const ratio = item.stock / item.minimum_stock;
  const percentage = Math.min(ratio * 100, 100);

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

  let barColor = "bg-red-500";
  let textColor = "text-red-500";

  if (ratio >= 1.3) {
    barColor = "bg-green-500";
    textColor = "text-green-500";
  } else if (ratio >= 1) {
    barColor = "bg-amber-500";
    textColor = "text-amber-500";
  }

  return (
    <div className="flex flex-col gap-1 w-32">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full`}
          style={{
            width: `${width}%`,
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        {direction && (
          <span className={`text-[9px] ${direction === "up" ? "text-green-500" : "text-red-500"}`}>
            {direction === "up" ? "▲" : "▼"}
          </span>
        )}
        <span className={`text-[10px] font-medium ${textColor}`}>
          {item.stock} / {item.minimum_stock} {item.unit_code ? item.unit_code : ""}
        </span>
      </div>
    </div>
  );
}