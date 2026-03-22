"use client";
import {
  MdLocationOn,
  MdPerson,
  MdWarehouse,
  MdEvent,
  MdCategory,
  MdInfo,
  MdNote,
  MdOutlineEditNote,
} from "react-icons/md";
import { formatDate, timeAgo } from "../../../utils/formatters";
import { RequisitionViewModel } from "../types/requisition-view.model";

import RequisitionTimeline from "./RequisitionTimeline";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import InfoCard from "@/app/components/InforCard";
import ActionButton from "@/app/components/ActionButton";
import { RETURN_STATUS_CONFIG } from "@/constants/ReturnStatusConfig";
import { IoMdReturnLeft } from "react-icons/io";
import InfoBadge from "@/app/components/badges/InfoBadge";
import { RequisitionType } from "../types/requisition-type.enum";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_CONFIG } from "@/constants/RequisitionStatus";

type Props = {
  requisition: RequisitionViewModel;
};

export default function RequisitionHeader({ requisition }: Props) {
  return (
    <div className="space-y-2">
      {/* 🔷 HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            #{requisition?.id}
          </h2>
        </div>

        {requisition?.updated_at && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Actualizado {timeAgo(requisition?.updated_at)}
          </span>
        )}
      </div>

      {/* 🔷 GRID PRINCIPAL */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Resumen de Requisición
          </h3>
        </div>

        {/* GRID COMPACTO */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3 text-sm">
          {(() => {
            const config = REQUISITION_TYPE_CONFIG[requisition?.type];
            const Icon = config?.icon;
            return (
              <InfoBadge
                label="Tipo de requisición"
                icon={
                  Icon ? (
                    <Icon className="text-blue-400" />
                  ) : (
                    <MdCategory className="text-blue-400" />
                  )
                }
                value={config?.label}
              />
            );
          })()}

          {requisition?.destination_location_name && (
            <InfoBadge
              label="Destino"
              icon={<MdWarehouse className="text-blue-500" />}
              value={requisition?.destination_location_name}
            />
          )}

          {requisition?.destination_address && (
            <InfoBadge
              label="Dirección"
              icon={<MdLocationOn className="text-blue-500" />}
              value={requisition?.destination_address}
            />
          )}

          <InfoBadge
            label="Solicitado por"
            icon={<MdPerson className="text-blue-500" />}
            value={requisition?.requestor_name}
          />

          <InfoBadge
            label="Aprobado por"
            icon={<MdPerson className="text-blue-500" />}
            value={requisition?.approver_name}
          />

          <InfoBadge
            label="Fecha programada"
            icon={<MdEvent className="text-blue-500" />}
            value={
              requisition?.schedulled_at
                ? formatDate(requisition?.schedulled_at)
                : "No programada"
            }
          />

          <InfoBadge
            label="Estado"
            icon={<MdInfo className="text-blue-500" />}
            badgeValue={REQUISITION_STATUS_CONFIG[requisition?.status]?.label}
            variant={REQUISITION_STATUS_CONFIG[requisition?.status]?.className}
          />

          {(requisition?.type === RequisitionType.RENT ||
            requisition?.type === RequisitionType.TRANSFER) && (
            <InfoBadge
              label="Estado de devolución"
              icon={<IoMdReturnLeft className="text-blue-500" />}
              badgeValue={
                RETURN_STATUS_CONFIG[requisition?.return_status]?.label
              }
              variant={
                RETURN_STATUS_CONFIG[requisition?.return_status]?.className
              }
            />
          )}

          <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              <MdOutlineEditNote size={18} className="text-blue-500" />
              Notas
            </span>
            <p className="text-sm text-gray-700 leading-relaxed pl-5">
              {requisition?.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
