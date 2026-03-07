import Badge from "../Badge";
import { PrimaryBadge } from "../PrimaryBadge";

type UnitUsage = {
  id: string;
  hours_used: string | null;
  start_at: string;
  end_at?: string | null;
  location_name?: string | null;
  requisition_id?: number;
};

export function UnitUsageCard({ usage }: { usage: UnitUsage }) {
  const hasHours = usage.hours_used !== null;

  const start = new Date(usage.start_at);
  const end = usage.end_at ? new Date(usage.end_at) : new Date();

  const diffMs = end.getTime() - start.getTime();
  const daysInLocation = Math.max(
    0,
    Math.floor(diffMs / (1000 * 60 * 60 * 24)),
  );

  return (
    <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition p-4 space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {/* REQUISITION */}
        {usage.requisition_id && (
          <p className="text-xs text-gray-400">
            Requisición #{usage.requisition_id}
          </p>
        )}
      </div>

      {/* LOCATION */}
      {usage.location_name && (
        <div className="inline-flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z"
            />
            <circle cx="12" cy="11" r="2" />
          </svg>
          {usage.location_name}
        </div>
      )}

      {/* TIME INFO */}
      <div className="grid grid-cols-4 gap-4 text-xs text-gray-500">
        <div className="space-y-1.5">
          <p className="text-gray-400">Inicio</p>
          <p className="font-medium text-gray-700">{start.toLocaleString()}</p>
        </div>

        <div className="space-y-1.5">
          <p className="text-gray-400">Fin</p>
          {usage.end_at ? (
            <p className="font-medium text-gray-700">{end.toLocaleString()}</p>
          ) : (
            <p className="italic text-yellow-600">En uso</p>
          )}
        </div>

        <div>
          <p className="text-gray-400">Días</p>
          <PrimaryBadge
            label={String(daysInLocation)}
            variant="success"
          />
        </div>

        <div>
          <p className="text-gray-400">Uso</p>
          {hasHours ? (
            <PrimaryBadge
              label={String(usage.hours_used)}
              variant="success"
            />
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
              Pendiente
            </span>
          )}{" "}
        </div>
      </div>
    </div>
  );
}
