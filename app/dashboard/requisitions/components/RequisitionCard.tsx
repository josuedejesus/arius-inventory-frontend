import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { RequisitionViewModel } from "../dto/requisition-view-model.dto";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_CONFIG } from "@/constants/RequisitionStatus";

type Props = {
  requisition: RequisitionViewModel;
};

export default function RequisitionCard({ requisition }: Props) {
  return (
    <div
      key={requisition.id}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-50 border border-gray-100"
    >
      {/* 🔷 INFO */}
      <div className="min-w-0">
        {/* Tipo */}
        <p className="text-xs text-gray-400 truncate">
          {REQUISITION_TYPE_CONFIG[requisition.type].label}
        </p>

        {/* Código */}
        <p className="text-sm font-medium text-gray-800 truncate">
          {requisition.code}
        </p>

        {/* Destino */}
        <p className="text-xs text-gray-500 truncate">
          {requisition.destination_location_name || "Sin destino"}
        </p>

        {/* Extra (compacto) */}
        <p className="text-[11px] text-gray-400 truncate">
          {requisition.requestor_name} •{" "}
          {new Date(requisition.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* 🔷 STATUS */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <PrimaryBadge
          label={REQUISITION_STATUS_CONFIG[requisition.status].label}
          variant={REQUISITION_STATUS_CONFIG[requisition.status].className}
        />
      </div>
    </div>
  );
}
