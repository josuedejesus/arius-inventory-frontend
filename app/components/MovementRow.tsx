import { PrimaryBadge } from "./badges/PrimaryBadge";

type MovementRowProps = {
  movement: any;
  locationId: number;
};

export default function MovementRow({
  movement,
  locationId,
}: MovementRowProps) {
  const isEntry =
    Number(movement.destination_location_id) === Number(locationId);
  const isExit = movement.source_location_id === locationId;

  console.log("destino:" + movement.destination_location_id + locationId);

  console.log(movement);

  return (
    <div
      className="
    flex items-center justify-between
    px-4 py-3
    border-b last:border-b-0
    hover:bg-gray-50
    transition
  "
    >
      {/* Info principal */}
      <div className="flex-1 space-y-1 max-w-[180px] md:max-w-[260px]">
        {/* Código */}
        <p className="text-xs text-gray-600 font-medium">
          {movement.internal_code}
        </p>
        {/* Nombre */}
        <p className="text-sm font-semibold text-gray-900 truncate">
          {movement.item_name}
        </p>

        {/* Brand + Model */}
        {(movement.item_brand || movement.item_model) && (
          <p className="text-xs text-gray-500 truncate">
            {[movement.item_brand, movement.item_model]
              .filter(Boolean)
              .join(" • ")}
          </p>
        )}
      </div>

      <div className="text-sm font-semibold text-gray-700">
        x{movement.quantity} {movement.unit_code}
      </div>

      <div className="flex flex-col items-end">
        <PrimaryBadge
          label={isEntry ? "ENTRADA" : "SALIDA"}
          variant={
            isEntry ? "success" : "warning"
          }
        />

        <span className="mt-1 text-xs text-gray-400">
          {new Date(movement.executed_at).toLocaleDateString("es-HN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
