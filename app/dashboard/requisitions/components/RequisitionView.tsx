"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import FormSection from "../../../components/form/FormSection";
import RequisitionLinePhotosForm from "./RequisitionLinePhotosForm";
import { useAuth } from "@/context/AuthContext";
import RequisitionHeader from "./RequisitionHeader";
import { DataGrid } from "@/app/components/datagrid/DataGrid";
import { DataGridRow } from "@/app/components/datagrid/DataGridRow";
import { DataGridCell } from "@/app/components/datagrid/DataGridCell";
import RequisitionLineCard from "./RequisitionLineCard";
import { RequisitionViewModel } from "../types/requisition-view.model";
import { VIEW_MODE_BY_ROLE_STATUS } from "@/permissions/requisition.permissions";
import { ReturnStatus } from "../types/return-status.enum";
import ActionButton from "@/app/components/ActionButton";
import {
  MdArchive,
  MdArrowRightAlt,
  MdCheckCircle,
  MdEdit,
  MdNoPhotography,
  MdPendingActions,
  MdPrint,
  MdWarning,
} from "react-icons/md";
import { is, se } from "date-fns/locale";
import { FaSpinner } from "react-icons/fa";
import LoadingScreen from "@/app/components/LoadingScreen";
import { GridLoader, MoonLoader } from "react-spinners";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { useRequisitions } from "@/hooks/useRequisitions";
import { useRequisitionLines } from "@/hooks/useRequisitionLines";
import { on } from "events";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { RequisitionType } from "../types/requisition-type.enum";
import { IoMdCamera } from "react-icons/io";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import RequisitionTimeline from "./RequisitionTimeline";
import SavingScreen from "@/app/components/SavingScreen";

const columns = [
  { key: "item", title: "Ítem" },
  { key: "quantity", title: "Cantidad" },
  { key: "move", title: "Movimiento" },
  { key: "status", title: "Estado" },
  { key: "action", title: "Acción" },
];

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
  const [selectedItem, setSelectedItem] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [showAddPhotos, setShowAddPhotos] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnStatus, setReturnStatus] = useState<ReturnStatus>(
    ReturnStatus.NONE,
  );
  const [requisitionLines, setRequisitionLiness] = useState<any[]>([]);

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
    await getRequisitionLines(Number(requisition?.id)).then(
      setRequisitionLiness,
    );
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

  const ActionBar = () => (
    <div className="flex justify-end gap-3 mt-6">
      {isApprove && (
        <button
          onClick={() => handleApprove()}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          disabled={actionLoading}
        >
          Aprobar requisición
        </button>
      )}

      {isExecute && (
        <button
          onClick={() => handleExecute()}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
          disabled={actionLoading}
        >
          Ejecutar movimientos
        </button>
      )}

      {isReceive && (
        <button
          onClick={() => handleReceive()}
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
          <div className="flex items-center gap-2 flex-wrap pb-2">
            <ActionButton
              label="Editar"
              icon={<MdEdit />}
              color="bg-blue-50 text-blue-500 hover:bg-blue-100"
              onClick={() => onEdit()}
            />
            <ActionButton
              label="Archivar"
              icon={<MdArchive />}
              color="bg-orange-50 text-orange-500 hover:bg-orange-100"
              onClick={() => console.log("Archivar requisición")}
            />
            <ActionButton
              label="Generar PDF"
              icon={<MdPrint />}
              color="bg-gray-50 text-gray-500 hover:bg-gray-100"
              onClick={() => handleGeneratePDF()}
            />
          </div>

          <RequisitionHeader requisition={form} />

          {/* 🟣 TIMELINE (FULL WIDTH) */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
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

          <PagedDataGrid
            data={requisitionLines}
            total={requisitionLines.length}
            page={1}
            pageSize={DataGrid.length}
            onLoadData={() => {}}
            pagination={false}
          >
            <PagedDataGrid.Column field="item" title="Artículo">
              {(row) => (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">
                    {row.internal_code}
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {row.item_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {row.item_brand} · {row.item_model}
                  </span>
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
                {(row) => (
                  <BooleanBadge
                    value={row.has_return}
                    trueIcon={<MdCheckCircle />}
                    falseIcon={<MdWarning />}
                  />
                )}
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
    </>
  );
}
