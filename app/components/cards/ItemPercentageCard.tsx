type ItemPercentageCardProps = {
  item: any;
};

export default function ItemPercentageCard({ item }: ItemPercentageCardProps) {
  const ratio = item.stock / item.minimum_stock;

  const percentage = Math.min(ratio * 100, 100);

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
          className={`h-full ${barColor} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className={`text-[10px] font-medium ${textColor}`}>
        {item.stock} / {item.minimum_stock}
      </span>
    </div>
  );
}
