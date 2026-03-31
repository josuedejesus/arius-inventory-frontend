import { timeAgo, timeAgoDetailed } from "@/app/utils/formatters";

type Props = {
  label: React.ReactNode;
  movement: any;
};

export default function MovementCard({ label, movement }: Props) {
  const isEntry = movement.destination_location_id;
  const isExit = movement.source_location_id;

  const quantity = Number(movement.quantity || 0);

  console.log('data', movement);

  const date = movement.movement_date;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
      {/* 🔷 TEXTO */}
      <p className="flex gap-1 text-sm text-gray-700 leading-snug">
        <span
          className={`font-semibold ${
            isEntry ? "text-green-600" : "text-red-600"
          }`}
        >
          {isEntry ? "+" : "-"} {quantity}
        </span>{" "}
        <span className="font-medium">
          {label}
        </span>
      </p>

      {/* 🔷 TIEMPO */}
      <span className="text-xs text-gray-400 sm:ml-2">{timeAgo(date)}</span>
    </div>
  );
}
