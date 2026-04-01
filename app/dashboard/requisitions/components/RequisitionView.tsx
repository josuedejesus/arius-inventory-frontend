"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import RequisitionLinePhotosForm from "./RequisitionLinePhotosForm";
import { useAuth } from "@/context/AuthContext";
import RequisitionHeader from "./RequisitionHeader";
import { RequisitionViewModel } from "../dto/requisition-view-model.dto";
import { VIEW_MODE_BY_ROLE_STATUS } from "@/permissions/requisition.permissions";
import {
  MdArchive,
  MdCheckCircle,
  MdEdit,
  MdNoPhotography,
  MdPictureAsPdf,
  MdWarning,
} from "react-icons/md";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { useRequisitions } from "@/hooks/useRequisitions";
import { useRequisitionLines } from "@/hooks/useRequisitionLines";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { RequisitionType } from "../types/requisition-type.enum";
import { IoMdCamera } from "react-icons/io";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import RequisitionTimeline from "./RequisitionTimeline";
import SavingScreen from "@/app/components/SavingScreen";
import { RequisitionLineViewModel } from "../dto/requisition-line-view-model.dto";
import { useConfirm } from "@/hooks/userConfirm";

enum modes {
  VIEW,
  EDIT,
  APPROVE,
  EXECUTE,
  RECEIVE,
}

type Props = {
  requisition: RequisitionViewModel;
  mode: modes;
  onSuccess: () => void;
  onEdit: () => void;
};

export default function RequisitionView({
  requisition,
  onSuccess,
  onEdit,
}: Props) {
  const [form, setForm] = useState<RequisitionViewModel>(undefined!);
  const [selectedItem, setSelectedItem] =
    useState<RequisitionLineViewModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requisitionLines, setRequisitionLines] = useState<
    RequisitionLineViewModel[]
  >([]);

  const canEdit = [RequisitionStatus.DRAFT].includes(requisition?.status);

  const canCancel = [
    RequisitionStatus.DRAFT,
    RequisitionStatus.APPROVED,
    RequisitionStatus.IN_PROGRESS,
  ].includes(requisition?.status);

  const {
    getById: getRequisition,
    approve: approveRequisition,
    execute: executeRequisition,
    receive: receiveRequisition,
  } = useRequisitions();
  const { getByRequisitionId: getRequisitionLines } = useRequisitionLines();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([handleGetRequisition(), handleGetLines()]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (requisition?.id) {
      loadData();
    }
  }, [requisition?.id]);

  const { user } = useAuth();

  const role = user?.user_role;
  const status = requisition?.status;

  useEffect(() => {
    setMode(baseMode);
  }, [role, status]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const baseMode =
    VIEW_MODE_BY_ROLE_STATUS[role ?? ""]?.[status ?? ""] ?? modes.VIEW;

  const [mode, setMode] = useState<modes>(baseMode);

  const isApprove = mode === modes.APPROVE;
  const isExecute = mode === modes.EXECUTE;
  const isReceive = mode === modes.RECEIVE;

  const { confirm: openConfirm, ConfirmDialog } = useConfirm();

  const handleGeneratePDF = async () => {
    try {
      setActionLoading(true);
      const response = await axios.get(
        `${apiUrl}/pdf/${requisition?.id}/requisition`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `requisition-${requisition?.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      toast.error(error.message || "Error generando el PDF");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGetRequisition = async () => {
    const { success, data } = await getRequisition(Number(requisition?.id));
    if (success) {
      console.log(data);
      setForm(data);
    }
  };

  const handleGetLines = async () => {
    const data = await getRequisitionLines(Number(requisition?.id));
    setRequisitionLines(data);
  };

  const handleApprove = async () => {
    const { success } = await approveRequisition(Number(requisition?.id));
    if (success) {
      onSuccess();
      toast.success("Requisición aprobada exitosamente");
    }
  };

  const handleExecute = async () => {
    const { success } = await executeRequisition(Number(requisition?.id));
    if (success) {
      onSuccess();
      toast.success("Requisición ejecutada exitosamente");
    }
  };

  const handleReceive = async () => {
    const { success } = await receiveRequisition(Number(requisition?.id));
    if (success) {
      onSuccess();
      toast.success("Requisición recibida exitosamente");
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/requisitions/${requisition?.id}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      onSuccess();
      toast.success("Requisición cancelada exitosamente");
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "Error cancelando la requisición";
      toast.error(message);
    }
  };

  const ActionBar = () => (
    <div className="flex justify-end gap-3 mt-6">
      {isApprove && (
        <button
          onClick={() => {
            openConfirm({
              title: "Aprobar requisición",
              description: "¿Está seguro que desea aprobar esta requisición?",
              variant: "info",
              onConfirm: () => handleApprove(),
            });
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          disabled={actionLoading}
        >
          Aprobar requisición
        </button>
      )}

      {isExecute && (
        <button
          onClick={() => {
            openConfirm({
              title: "Ejecutar movimientos",
              description: "¿Está seguro que desea ejecutar estos movimientos?",
              variant: "info",
              onConfirm: () => handleExecute(),
            });
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          disabled={actionLoading}
        >
          Ejecutar movimientos
        </button>
      )}

      {isReceive && (
        <button
          onClick={() => {
            openConfirm({
              title: "Confirmar recepción",
              description:
                "¿Está seguro que desea confirmar la recepción de esta requisición?",
              variant: "info",
              onConfirm: () => handleReceive(),
            });
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          disabled={actionLoading}
        >
          Confirmar recepción
        </button>
      )}
    </div>
  );

  const RequisitionSkeleton = () => {
    return (
      <div className="space-y-4 animate-pulse">
        {/* ACTIONS */}
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-32 bg-gray-200 rounded" />
        </div>

        {/* HEADER */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 gap-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {/* header */}
          <div className="grid grid-cols-4 gap-2 bg-gray-100 p-3">
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-16" />
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-16" />
          </div>

          {/* rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 p-3 border-t">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>

              <div className="h-4 w-16 bg-gray-200 rounded self-center" />

              <div className="h-4 w-32 bg-gray-200 rounded self-center" />

              <div className="h-6 w-10 bg-gray-200 rounded self-center" />
            </div>
          ))}
        </div>

        {/* ACTION BAR */}
        <div className="flex justify-end gap-2">
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  };

  if (loading) {
    return <RequisitionSkeleton />;
  }

  return (
    <>
      <div className="relative">
        {actionLoading && <SavingScreen />}

        <div className="flex flex-col w-full  gap-2  cursor-pointer">
          {/*ACTIONS*/}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                onClick={canEdit ? onEdit : undefined}
                disabled={!canEdit}
                title={
                  !canEdit
                    ? "Solo se puede editar en estado borrador o aprobado"
                    : undefined
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors
    ${
      canEdit
        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
        : "text-gray-300 cursor-not-allowed"
    }`}
              >
                <MdEdit size={16} />
                Editar
              </button>

              <button
                onClick={() => {
                  openConfirm({
                    title: "Cancelar requisición",
                    description:
                      "¿Está seguro que desea cancelar esta requisición?",
                    variant: "danger",
                    onConfirm: () => handleCancel(),
                  });
                }}
                disabled={!canCancel}
                title={
                  !canCancel
                    ? "Solo se puede cancelar en estado borrador o aprobado"
                    : undefined
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors
                ${
                  canCancel
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                <MdArchive size={16} />
                Cancelar
              </button>

              <button
                onClick={handleGeneratePDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <MdPictureAsPdf size={16} />
                Generar PDF
              </button>
            </div>
          </div>

          <RequisitionHeader requisition={form} />

          {/* 🟣 TIMELINE (FULL WIDTH) */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <RequisitionTimeline
              created_at={requisition?.created_at}
              approved_at={requisition?.approved_at}
              executed_at={requisition?.executed_at}
              received_at={requisition?.received_at}
            />
          </div>

          <PagedDataGrid
            data={requisitionLines}
            total={requisitionLines.length}
            page={1}
            pageSize={1}
            onLoadData={() => {}}
            pagination={false}
          >
            <PagedDataGrid.Column field="item" title="Artículo">
              {(row) => (
                <div className="flex flex-col justify-center">
                  {row.internal_code && (
                    <span className="text-xs text-gray-500">
                      {row.internal_code}
                    </span>
                  )}
                  <span className="text-gray-800 font-semibold">
                    {row.name}
                  </span>
                  {row.brand && row.model && (
                    <span className="text-xs text-gray-500">
                      {row.brand} · {row.model}
                    </span>
                  )}
                </div>
              )}
            </PagedDataGrid.Column>

            <PagedDataGrid.Column field="quantity" title="Cantidad">
              {(row) => (
                <span className="text-xs text-gray-500">
                  {row.quantity} {row.unit_code}
                </span>
              )}
            </PagedDataGrid.Column>
            <PagedDataGrid.Column field="location" title="Ubicación">
              {(row) => (
                <span className="flex items-center justify-start text-xs text-gray-500">
                  {row.source_location_name}
                </span>
              )}
            </PagedDataGrid.Column>

            <PagedDataGrid.Column field="accessories" title="Accesorios">
              {(row) => (
                <span className="flex items-center justify-start text-xs text-gray-500">
                  {row.accessories && row.accessories.length > 0
                    ? row.accessories
                        .map((a: any) => `${a.quantity}x ${a.name}`)
                        .join(", ")
                    : "N/A"}{" "}
                </span>
              )}
            </PagedDataGrid.Column>

            <PagedDataGrid.Column field="photos" title="Fotos">
              {(row) => (
                <BooleanBadge
                  value={row.photos_count > 0}
                  trueLabel={row.photos_count.toString()}
                  falseLabel="0"
                  trueIcon={<IoMdCamera />}
                  falseIcon={<MdNoPhotography />}
                  onClick={() => {
                    setSelectedItem(row);
                    setShowAddPhotos(true);
                  }}
                />
              )}
            </PagedDataGrid.Column>

            {requisition.type === RequisitionType.RENT ||
            requisition.type === RequisitionType.TRANSFER ? (
              <PagedDataGrid.Column field="return" title="Retorno">
                {(row) =>
                  row.item_unit_id ? (
                    <BooleanBadge
                      value={row.has_return}
                      trueIcon={<MdCheckCircle />}
                      falseIcon={<MdWarning />}
                    />
                  ) : (
                    <span></span>
                  )
                }
              </PagedDataGrid.Column>
            ) : null}
          </PagedDataGrid>

          <ActionBar />
        </div>
      </div>

      <Modal
        open={showAddPhotos}
        title="Evidencia del estado de salida"
        onClose={() => setShowAddPhotos(false)}
      >
        <RequisitionLinePhotosForm
          mode={mode}
          line={selectedItem}
          onSuccess={() => {
            setShowAddPhotos(false);
            handleGetLines();
          }}
          onClose={() => setShowAddPhotos(false)}
        />
      </Modal>

      <ConfirmDialog />
    </>
  );
}
