import { REQUISITION_STATUS_LABELS } from "@/constants/RequisitionStatus";
import { formatDate } from "../../utils/formatters";
import { REQUISITION_TYPE_LABELS } from "@/constants/RequisitionType";
import { RETURN_STATUS_LABELS } from "@/constants/ReturnStatus";
import { RequisitionType } from "@/app/dashboard/requisitions/types/requisition-type.enum";

type Requisition = {
  id: number;
  requested_by: number;
  source_location_id: number;
  destination_location_id: number;
  type: RequisitionType;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;

  requestor: string;
  source_location_name: string;
  destination_location_name: string;
  return_status: string;
};

type RequisitionCardProps = {
  requisition: Requisition;
  onClick: (requisition: Requisition) => void;
};

export default function RequisitionCard({
  requisition,
  onClick,
}: RequisitionCardProps) {
  return (
    <>
      <div
        onClick={() => onClick(requisition)}
        className="
    cursor-pointer
    px-4 py-3
    grid grid-cols-[3fr_4fr_2fr_2fr]
    items-center gap-4
    bg-white
    border border-gray-100
    hover:bg-gray-50
    transition-colors
    rounded-md
  "
      >
        {/* Nombre */}
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {REQUISITION_TYPE_LABELS[requisition.type] ?? requisition.type}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {requisition.requestor}
          </p>
        </div>

        {/* Locations */}
        <p className="flex items-center text-sm text-gray-700 truncate">
          <span className="font-medium truncate max-w-[40%] md:max-w-none">
            {requisition.source_location_name}
          </span>

          <svg
            className="h-4 w-4 text-gray-400 shrink-0 mx-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>

          <span className="font-medium truncate max-w-[40%] md:max-w-none">
            {requisition.destination_location_name}
          </span>
        </p>

        {/* Status */}
        <div className="flex justify-start">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium
        ${
          requisition.status === "DRAFT"
            ? "text-gray-500"
            : requisition.status === "APPROVED"
              ? "text-blue-600"
              : requisition.status === "IN_PROGRESS"
                ? "text-yellow-600"
                : requisition.status === "DONE"
                  ? "text-green-600"
                  : "text-red-600"
        }
      `}
          >
            <span
              className={`h-2 w-2 rounded-full
          ${
            requisition.status === "DRAFT"
              ? "bg-gray-400"
              : requisition.status === "APPROVED"
                ? "bg-blue-500"
                : requisition.status === "IN_PROGRESS"
                  ? "bg-yellow-500"
                  : requisition.status === "DONE"
                    ? "bg-green-500"
                    : "bg-red-500"
          }
        `}
            />
            {REQUISITION_STATUS_LABELS[requisition.status] ??
              requisition.status}
          </span>
        </div>

        {/* RETURN STATUS */}
        <div className="flex justify-start">
          {requisition.return_status && requisition.status !== "DRAFT" ? (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium
          ${
            requisition.return_status === "FULL"
              ? "text-green-600"
              : requisition.return_status === "PARTIAL"
                ? "text-yellow-600"
                : "text-red-600"
          }
        `}
            >
              <span
                className={`h-2 w-2 rounded-full
            ${
              requisition.return_status === "FULL"
                ? "bg-green-500"
                : requisition.return_status === "PARTIAL"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          `}
              />
              {RETURN_STATUS_LABELS[requisition.return_status]}
            </span>
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </div>
      </div>
    </>
  );
}
