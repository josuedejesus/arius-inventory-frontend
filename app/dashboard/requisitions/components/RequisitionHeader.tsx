import React from "react";
import { MdEvent, MdWarehouse, MdLocationOn } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";
import { RequisitionType } from "@/app/dashboard/requisitions/types/requisition-type.enum";
import { RETURN_STATUS_CONFIG } from "@/constants/ReturnStatusConfig";
import { formatDate } from "@/app/utils/formatters";
import { MOVEMENT_TYPE_CONFIG } from "@/constants/MovementTypeConfig";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_CONFIG } from "@/constants/RequisitionStatus";
import { RequisitionViewModel } from "../dto/requisition-view-model.dto";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { ROLE_REASON_OPTIONS } from "../types/role-reason-options";
import { useAuth } from "@/context/AuthContext";

type Props = {
  requisition: RequisitionViewModel;
};

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

type InfoCellProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

function InfoCell({ label, children, className = "" }: InfoCellProps) {
  return (
    <div className={`px-5 py-3.5 ${className}`}>
      <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 font-medium">
        {label}
      </p>
      {children}
    </div>
  );
}

type AvatarProps = {
  name: string;
  color?: "blue" | "teal";
};

function Avatar({ name, color = "blue" }: AvatarProps) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${styles[color]}`}
      >
        {getInitials(name)}
      </div>
      <span className="text-sm font-medium text-gray-800">{name}</span>
    </div>
  );
}

export default function RequisitionHeader({ requisition }: Props) {
  const user = useAuth().user;

  const movementConfig = MOVEMENT_TYPE_CONFIG[requisition?.movement];
  const typeConfig = ROLE_REASON_OPTIONS[user?.user_role as string]?.find(
    (opt) => opt.reason === requisition?.type,
  );
  const statusConfig = REQUISITION_STATUS_CONFIG[requisition?.status];
  const returnStatusConfig = RETURN_STATUS_CONFIG[requisition?.return_status];
  const MovementIcon = movementConfig?.icon;

  const showReturnStatus =
    requisition?.type === RequisitionType.RENT ||
    requisition?.type === RequisitionType.TRANSFER;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* HEADER — movimiento y tipo como protagonistas */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            {MovementIcon && (
              <MovementIcon size={20} className="text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-lg font-semibold text-gray-900">
                {movementConfig?.label}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{typeConfig?.label}</span>
            </div>
            <span className="text-xs text-gray-400">{requisition?.code}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showReturnStatus && returnStatusConfig && (
            <PrimaryBadge
              label={returnStatusConfig.label}
              variant={returnStatusConfig.className}
            />
          )}
          {statusConfig && (
            <PrimaryBadge
              label={statusConfig.label}
              variant={statusConfig.className}
            />
          )}
        </div>
      </div>

      {/* GRID DE DETALLES */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <InfoCell
          label="Solicitado por"
          className="border-b sm:border-b border-r-0 sm:border-r border-gray-100"
        >
          <Avatar name={requisition?.requestor_name} color="blue" />
        </InfoCell>

        <InfoCell
          label="Aprobado por"
          className="border-b sm:border-b border-r-0 sm:border-r border-gray-100"
        >
          <Avatar name={requisition?.approver_name} color="teal" />
        </InfoCell>

        <InfoCell label="Fecha programada" className="border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <MdEvent size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-800">
              {requisition?.schedulled_at
                ? formatDate(requisition.schedulled_at)
                : "No programada"}
            </span>
          </div>
        </InfoCell>

        {requisition?.destination_location_name && (
          <InfoCell
            label="Destino"
            className="border-b sm:border-b-0 border-r-0 sm:border-r border-gray-100"
          >
            <div className="flex items-center gap-1.5">
              <MdWarehouse size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">
                {requisition.destination_location_name}
              </span>
            </div>
          </InfoCell>
        )}

        {requisition?.destination_address && (
          <InfoCell
            label="Dirección"
            className="border-b sm:border-b-0 border-r-0 sm:border-r border-gray-100"
          >
            <div className="flex items-center gap-1.5">
              <MdLocationOn size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">
                {requisition.destination_address}
              </span>
            </div>
          </InfoCell>
        )}

        {requisition?.notes && (
          <InfoCell
            label="Notas"
            className="col-span-1 sm:col-span-3 border-t border-gray-100"
          >
            <p className="text-sm text-gray-500 leading-relaxed">
              {requisition.notes}
            </p>
          </InfoCell>
        )}
      </div>
    </div>
  );
}
