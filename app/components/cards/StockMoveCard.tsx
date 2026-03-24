import { timeAgo, timeAgoDetailed } from "@/app/utils/formatters";

type Props = {
  movement: any;
  locationId: number;
};

export default function MovementCard({ movement, locationId }: Props) {
  const isEntry = movement.destination_location_id == locationId;
  const isExit = movement.source_location_id == locationId;

  const quantity = Number(movement.quantity || 0);

  const date = movement.movement_date;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
      {/* 🔷 TEXTO */}
      <p className="text-sm text-gray-700 leading-snug">
        <span
          className={`font-semibold ${
            isEntry ? "text-green-600" : "text-red-600"
          }`}
        >
          {isEntry ? "+" : "-"} {quantity}
        </span>{" "}
        <span className="font-medium">
          {movement.item_name}
          {(movement.item_brand || movement.item_model) && (
            <span className="text-gray-400 font-normal">
              {" "}
              • {movement.item_brand}
              {movement.item_model && ` ${movement.item_model}`}
            </span>
          )}
        </span>
      </p>

      {/* 🔷 TIEMPO */}
      <span className="text-xs text-gray-400 sm:ml-2">{timeAgo(date)}</span>
    </div>
  );
}
