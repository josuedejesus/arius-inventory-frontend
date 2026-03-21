"use client";

import { REQUISITION_TYPE_LABELS } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_LABELS } from "@/constants/RequisitionStatus";

import {
  MdLocationOn,
  MdSchedule,
  MdPerson,
  MdEdit,
  MdPrint,
  MdArchive,
  MdInventory,
  MdWarehouse,
  MdEvent,
  MdCategory,
  MdSignalWifiStatusbar1Bar,
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
          <InfoBadge
            label="Destino"
            icon={<MdWarehouse className="text-blue-400" />}
            value={requisition?.destination_location_name}
          />

          <InfoBadge
            label="Dirección"
            icon={<MdLocationOn className="text-orange-400" />}
            value={requisition?.destination_address}
          />

          <InfoBadge
            label="Tipo de requisición"
            icon={<MdCategory className="text-purple-400" />}
            value={REQUISITION_TYPE_LABELS[requisition?.type]?.label}
          />

          <InfoBadge
            label="Solicitado por"
            icon={<MdPerson className="text-blue-400" />}
            value={requisition?.requestor_name}
          />

          <InfoBadge
            label="Aprobado por"
            icon={<MdPerson className="text-orange-400" />}
            value={requisition?.approver_name}
          />

          <InfoBadge
            label="Fecha programada"
            icon={<MdEvent className="text-gray-500" />}
            value={
              requisition?.schedulled_at
                ? formatDate(requisition?.schedulled_at)
                : "No programada"
            }
          />

          <InfoBadge
            label="Estado"
            icon={<MdInfo className="text-yellow-500" />}
            badgeValue={REQUISITION_STATUS_LABELS[requisition?.status]?.label}
            variant={REQUISITION_STATUS_LABELS[requisition?.status]?.className}
          />

          {(requisition?.type === RequisitionType.RENT ||
            requisition?.type === RequisitionType.TRANSFER) && (
            <InfoBadge
              label="Estado de devolución"
              icon={<IoMdReturnLeft className="text-orange-400" />}
              badgeValue={
                RETURN_STATUS_CONFIG[requisition?.return_status]?.label
              }
              variant={
                RETURN_STATUS_CONFIG[requisition?.return_status]?.className
              }
            />
          )}

          <InfoBadge
            label="Notas"
            icon={<MdOutlineEditNote className="text-orange-400" />}
            value={requisition?.notes}
          />
        </div>

       
      </div>
    </div>
  );
}
