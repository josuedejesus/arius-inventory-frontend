import { timeAgo } from "@/app/utils/formatters";
import {
  MdMoveToInbox,
  MdOutbox,
} from "react-icons/md";

type Props = {
  label: string;
  description?: string;
  movement: any;
};

export default function MovementCard({ label, description, movement }: Props) {
  const isEntry = movement.destination_location_id;
  const isExit = movement.source_location_id;

  const quantity = Number(movement.quantity || 0);

  console.log("data", movement);

  const date = movement.movement_date;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
      {/* 🔷 ICONO */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-md ${
          isEntry ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isEntry ? (
          <MdMoveToInbox className="w-4 h-4 text-green-600" />
        ) : (
          <MdOutbox className="w-4 h-4 text-red-600" />
        )}
      </div>

      {/* 🔷 CONTENIDO */}
      <div className="flex flex-col text-xs min-w-0">
        {/* LABEL */}
        <span className="text-gray-700 text-sm font-medium truncate">
          {label}
        </span>

        {/* DESCRIPTION */}
        {description && (
          <span className="text-gray-400 truncate">{description}</span>
        )}

        {/* CANTIDAD */}
        <p className="text-sm leading-snug">
          <span
            className={`font-semibold ${
              isEntry ? "text-green-600" : "text-red-600"
            }`}
          >
            {isEntry ? "+" : "-"} {quantity}
          </span>
        </p>

        {/* TIEMPO */}
        <span className="text-xs text-gray-400">{timeAgo(date)}</span>
      </div>
    </div>
  );
}
