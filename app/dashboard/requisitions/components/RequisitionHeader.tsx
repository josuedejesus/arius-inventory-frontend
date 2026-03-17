"use client";

import { REQUISITION_TYPE_LABELS } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_LABELS } from "@/constants/RequisitionStatus";

import {
  MdLocationOn,
  MdSchedule,
  MdPerson,
  MdEdit,
  MdPrint,
} from "react-icons/md";
import { formatDate, timeAgo } from "../../../utils/formatters";
import { RequisitionViewModel } from "../types/requisition-view.model";

import RequisitionTimeline from "./RequisitionTimeline";
import { PrimaryBadge } from "@/app/components/PrimaryBadge";
import InfoCard from "@/app/components/InforCard";
import ActionButton from "@/app/components/ActionButton";

type Props = {
  requisition: RequisitionViewModel;
};

export default function RequisitionHeader({ requisition }: Props) {
  return (
    <div className="space-y-6">
      {/* 🔷 HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            #{requisition?.id}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <PrimaryBadge
              label={REQUISITION_TYPE_LABELS[requisition?.type]}
              className="bg-gray-100 text-gray-700"
            />

            <PrimaryBadge
              label={REQUISITION_STATUS_LABELS[requisition?.status]?.label}
              variant={`${REQUISITION_STATUS_LABELS[requisition?.status]?.className}`}
            />

            <ActionButton
              label="Editar"
              icon={<MdEdit />}
              onClick={() => console.log("Editar requisición")}
            />
            <ActionButton
              label="Imprimir como PDF"
              icon={<MdPrint />}
              color="bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => console.log("Imprimir requisición")}
            />
          </div>
        </div>

        {requisition?.updated_at && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            Actualizado {timeAgo(requisition?.updated_at)}
          </span>
        )}
      </div>

      {/* 🔷 GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🟢 INFORMACIÓN GENERAL */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Información General
          </h3>

          <div className="space-y-3">
            <InfoCard
              icon={<MdPerson className="text-sky-500" />}
              label="Solicitado por"
              value={requisition?.requestor_name ?? "—"}
            />

            {requisition?.approved_by && (
              <InfoCard
                icon={<MdPerson className="text-sky-500" />}
                label="Aprobado por"
                value={requisition?.approver_name ?? "—"}
              />
            )}

            <InfoCard
              icon={<MdLocationOn className="text-orange-400" />}
              label="Destino"
              value={requisition?.destination_location_name ?? "—"}
            />
            <InfoCard
              icon={<MdSchedule className="text-green-500" />}
              label="Programado para"
              value={formatDate(requisition?.schedulled_at)}
            />
          </div>
        </div>

        {/* 🔵 ESTADO */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Estado
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Estado</span>
              <PrimaryBadge
                label={REQUISITION_STATUS_LABELS[requisition?.status]?.label}
                variant={`${REQUISITION_STATUS_LABELS[requisition?.status]?.className}`}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Tipo</span>
              <PrimaryBadge
                label={REQUISITION_TYPE_LABELS[requisition?.type]}
                className="bg-gray-100 text-gray-700"
              />
            </div>

            {requisition?.updated_at && (
              <div className="text-xs text-gray-400 pt-2 border-t">
                Última actualización: {formatDate(requisition?.updated_at)}
              </div>
            )}
          </div>
        </div>

        {/* 🟡 NOTAS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Notas
          </h3>

          {requisition?.notes ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              {requisition?.notes}
            </p>
          ) : (
            <div className="text-sm text-gray-400 text-center py-6">
              No hay notas disponibles
            </div>
          )}
        </div>
      </div>

      {/* 🟣 TIMELINE (FULL WIDTH) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Linea de Tiempo
        </h3>

        <RequisitionTimeline
          created_at={requisition?.created_at}
          approved_at={requisition?.approved_at}
          executed_at={requisition?.executed_at}
          received_at={requisition?.received_at}
        />
      </div>
    </div>
  );
}
