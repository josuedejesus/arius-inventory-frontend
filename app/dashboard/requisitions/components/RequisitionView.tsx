"use client";

import axios from "axios";
import { useEffect, useState } from "react";
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
import { MdEdit } from "react-icons/md";
import { is, se } from "date-fns/locale";
import { FaSpinner } from "react-icons/fa";
import LoadingScreen from "@/app/components/LoadingScreen";
import { GridLoader, MoonLoader } from "react-spinners";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { useRequisitions } from "@/hooks/useRequisitions";
import { useRequisitionLines } from "@/hooks/useRequisitionLines";
import { on } from "events";

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

  //calculate return statysus based on lines if returned lines > 0 partital, 0 none, returned lines = total lines full, you need to validate lines.has_returned = true to consider returned
  const calculateReturnStatus = (lines: any[]) => {
    const totalLines = lines.length;
    const returnedLines = lines.filter((line) => line.has_return).length;
    if (returnedLines === 0) setReturnStatus(ReturnStatus.NONE);
    if (returnedLines < totalLines && returnedLines > 0)
      setReturnStatus(ReturnStatus.PARTIAL);
    if (returnedLines === totalLines) setReturnStatus(ReturnStatus.FULL);
  };

  const handleUploadPhotos = async (files: any[]) => {
    const formData = new FormData();

    formData.append("requisition_line_id", selectedItem.id);
    files.forEach((f) => {
      formData.append("images", f);
    });

    await axios
      .post(`${apiUrl}/requisition-line-photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        handleGetLines();
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
        }
        throw error;
      })
      .finally(() => {});
  };

  const handleGetRequisition = async () => {
    const { success, data } = await getRequisition(Number(requisition?.id));
    if (success) {
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

  const ReadOnlyView = () => (
    <FormSection title="" description="">
      <DataGrid>
        <DataGridRow className="grid px-4 py-3 text-[11px] tracking-wide text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          {columns.map((col) => (
            <DataGridCell key={col.key} className="font-bold">
              {col.title}
            </DataGridCell>
          ))}
        </DataGridRow>
        {requisitionLines.map((line) => (
          <RequisitionLineCard
            key={line?.id}
            requisition={requisition}
            line={line}
            onClick={(line) => {
              console.log("row click", line);
            }}
            onPhotos={(line) => {
              console.log("photos", line);
              setSelectedItem(line);
              setShowAddPhotos(true);
            }}
            onRemove={(line) => {
              console.log("removing", line);
            }}
          />
        ))}
      </DataGrid>
    </FormSection>
  );

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="relative">
        {actionLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <MoonLoader color="#2563eb" />{" "}
          </div>
        )}

        <div className={actionLoading ? "pointer-events-none opacity-60" : ""}>
          <div>
            {requisition?.status === RequisitionStatus.DRAFT && (
              <ActionButton icon={<MdEdit />} label="Editar" onClick={onEdit} />
            )}
          </div>

          <RequisitionHeader requisition={form} />

          <ReadOnlyView />

          <ActionBar />
        </div>
      </div>

      <Modal open={showAddPhotos} onClose={() => setShowAddPhotos(false)}>
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
