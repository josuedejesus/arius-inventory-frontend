import { REQUISITION_TYPE_LABELS } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_LABELS } from "@/constants/RequisitionStatus";
import { RETURN_STATUS_LABELS } from "@/constants/ReturnStatus";

import { MdLocationOn, MdSchedule, MdPerson } from "react-icons/md";
import { formatDate, timeAgo } from "../../../utils/formatters";
import { RequisitionViewModel } from "../types/requisition-view.model";
import { RequisitionType } from "../types/requisition-type.enum";
import RequisitionTimeline from "./RequisitionTimeline";

type Props = {
  requisition: RequisitionViewModel;
};

export default function RequisitionHeader({ requisition }: Props) {
  console.log(requisition);
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 space-y-5">
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Requisición #{requisition?.id}
          </h2>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge>{REQUISITION_TYPE_LABELS[requisition?.type]}</Badge>

            <Badge color="blue">
              {REQUISITION_STATUS_LABELS[requisition?.status]}
            </Badge>
          </div>
        </div>

        {requisition?.updated_at && (
          <span className="text-xs text-gray-400">
            Actualizado {timeAgo(requisition?.updated_at)}
          </span>
        )}
      </div>

      {/* METADATA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          icon={<MdPerson color="blue" />}
          label="Solicitado por"
          value={requisition?.requestor_name ?? "—"}
        />

        {requisition?.approved_by && (
          <InfoCard
            icon={<MdPerson color="blue" />}
            label="Aprobado por"
            value={requisition?.approver_name ?? "—"}
          />
        )}

        <InfoCard
          icon={<MdSchedule color="green" />}
          label="Programado"
          value={formatDate(requisition?.schedulled_at)}
        />

        <InfoCard
          icon={<MdLocationOn color="orange" />}
          label="Destino"
          value={requisition?.destination_location_name ?? "—"}
        />
      </div>

      {/* TIMELINE */}
      <RequisitionTimeline
        created_at={requisition?.created_at}
        approved_at={requisition?.approved_at}
        executed_at={requisition?.executed_at}
        received_at={requisition?.received_at}
      />

      {/* ORIGEN → DESTINO */}
      <div className="flex items-center justify-center gap-4 text-gray-700">
        {requisition?.destination_location_name && (
          <span className="font-medium">
            {requisition?.destination_location_name}
          </span>
        )}
      </div>

      {/* NOTES */}
      {requisition?.notes && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Notas</div>
          <p className="text-sm text-gray-600">{requisition?.notes}</p>
        </div>
      )}
    </div>
  );
}

function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const colors: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
      <div className="text-gray-400 text-lg">{icon}</div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}</span>
      </div>
    </div>
  );
}

function TimelineCard({
  color,
  title,
  date,
}: {
  color: string;
  title: string;
  date: string;
}) {
  const colors: Record<string, string> = {
    gray: "bg-gray-100 border-gray-400",
    blue: "bg-blue-100 border-blue-400",
    yellow: "bg-yellow-100 border-yellow-400",
    green: "bg-green-100 border-green-400",
  };

  return (
    <div className={`border rounded-lg px-3 py-2 text-sm ${colors[color]}`}>
      <div className="text-xs text-gray-400">{title}</div>
      <div className="font-medium">{formatDate(date)}</div>
    </div>
  );
}

function formatType(type?: RequisitionType) {
  if (!type) return "Requisition";

  const map: Record<string, string> = {
    [RequisitionType.RENT]: "Rent",
    [RequisitionType.TRANSFER]: "Transfer",
    [RequisitionType.ADJUSTMENT]: "Adjustment",
    [RequisitionType.PURCHASE_RECEIPT]: "Purchase Receipt",
    [RequisitionType.CONSUMPTION]: "Consumption",
    [RequisitionType.RETURN]: "Return",
    [RequisitionType.SALE]: "Sale",
  };

  return map[type] ?? type;
}
