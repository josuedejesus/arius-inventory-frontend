"use client";

import Modal from "@/app/components/Modal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NewRequisitionForm from "@/app/dashboard/requisitions/components/NewRequisitionForm";
import { useAuth } from "@/context/AuthContext";
import { useSSE } from "@/hooks/userSSE";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";
import RequisitionView from "@/app/dashboard/requisitions/components/RequisitionView";
import UpdateRequisitionForm from "./components/UpdateRequisitionForm";
import { useRequisitions } from "@/hooks/useRequisitions";
import LoadingScreen from "@/app/components/LoadingScreen";
import { REQUISITION_TYPE_LABELS } from "@/constants/RequisitionType";
import { RequisitionViewModel } from "./types/requisition-view.model";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import { RETURN_STATUS_LABELS } from "@/constants/ReturnStatus";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { REQUISITION_STATUS_LABELS } from "@/constants/RequisitionStatus";
import { MdArchive, MdDescription, MdEdit, MdVisibility } from "react-icons/md";
import { RETURN_STATUS_CONFIG } from "@/constants/ReturnStatusConfig";

enum modes {
  VIEW,
  EDIT,
  APPROVE,
  EXECUTE,
  RECEIVE,
}

const VIEW_MODE_BY_ROLE_STATUS: Record<string, Record<string, modes>> = {
  WAREHOUSE_MANAGER: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.EXECUTE,
    IN_PROGRESS: modes.RECEIVE,
  },
  ADMINISTRATIVE_MANAGER: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.VIEW,
  },
  ADMIN: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.EXECUTE,
    IN_PROGRESS: modes.RECEIVE,
  },
  CONTRACTOR: {
    DRAFT: modes.VIEW,
    APPROVED: modes.VIEW,
  },
  CLIENT: {
    DRAFT: modes.VIEW,
    APPROVED: modes.VIEW,
  },
};

export default function Requisitions() {
  //User
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(18);

  const [total, setTotal] = useState(0);

  const [sorting, setSorting] = useState("");

  //Requisitions
  const [requisitions, setRequisitions] = useState<any>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<any | null>(
    null,
  );

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredRequisitions = requisitions.filter((u: any) =>
    `${u.name} ${u.model} ${u.brand} ${u.email}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const [showNewRequisition, setShowNewRequisition] = useState<boolean>(false);
  const [showRequisition, setShowRequisition] = useState<boolean>(false);
  const [showUpdateRequisition, setShowUpdateRequisition] =
    useState<boolean>(false);

  const { getAll: getRequisitions, loading } = useRequisitions();

  const handleGetRequisitions = async ({
    skip,
    take,
  }: {
    skip: number;
    take: number;
  }) => {
    const newPage = skip / take + 1;
    setPage(newPage);

    const { data } = await getRequisitions({
      skipCount: skip,
      maxResultCount: take,
    });
    setRequisitions(data.items);
    setTotal(data.total);
  };

  useSSE({
    "requisition.created": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Nueva requisición creada");
    },
    "requisition.approved": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Una requisición fue aprovada");
    },
    "requisition.executed": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Una requisición fue ejecutada");
    },
    "requisition.received": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Una requisición fue recibida");
    },
  });

  const handleViewRequisition = (requisition: any) => {
    setSelectedRequisition(requisition);
    setShowRequisition(true);
  };

  useEffect(() => {
    handleGetRequisitions({ skip: 0, take: pageSize });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="">
        <div className="flex requisitions-start justify-between space-x-2">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Requisiciones
          </h1>

          <button
            onClick={() => setShowNewRequisition(true)}
            className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
          >
            <span className="text-lg">＋</span>
          </button>
        </div>

        <PagedDataGrid
          data={requisitions}
          total={total}
          page={page}
          pageSize={pageSize}
          onLoadData={handleGetRequisitions}
          onRowClick={(row) => handleViewRequisition(row)}
        >
          <PagedDataGrid.Column field="id" title="ID">
            {(row: RequisitionViewModel) => (
              <span className="text-gray-600">
                {row.id}
              </span>
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="type" title="Tipo">
            {(row: RequisitionViewModel) => (
              <span className="text-gray-600">
                {REQUISITION_TYPE_LABELS[row.type].label}
              </span>
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="requestor_name" title="Solicitante">
            {(row: RequisitionViewModel) => (
              <span className="text-gray-600">{row.requestor_name}</span>
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column
            field="destination_location_name"
            title="Destino"
          >
            {(row: RequisitionViewModel) => (
              <span className="font-medium truncate max-w-[40%] md:max-w-none">
                {row.destination_location_name}
              </span>
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="status" title="Estado">
            {(row: RequisitionViewModel) => (
              <PrimaryBadge
                label={REQUISITION_STATUS_LABELS[row.status].label}
                variant={`${REQUISITION_STATUS_LABELS[row.status].className}`}
              />
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="returned" title="Retornado">
            {(row: RequisitionViewModel) => (
              <PrimaryBadge
                label={RETURN_STATUS_CONFIG[row?.return_status]?.label}
                variant={`${RETURN_STATUS_CONFIG[row?.return_status]?.className}`}
              />
            )}
          </PagedDataGrid.Column>
          
        </PagedDataGrid>
      </div>

      {/*NEW REQUISITION*/}
      <Modal
        open={showNewRequisition}
        title="Nueva Requisicion"
        onClose={() => setShowNewRequisition(false)}
      >
        <NewRequisitionForm
          onSuccess={() => {
            setShowNewRequisition(false);
            handleGetRequisitions({ skip: 0, take: pageSize });
          }}
        />
      </Modal>

      {/*VIEW REQUISITION*/}
      <Modal
        open={showRequisition}
        title="Requisición"
        onClose={() => setShowRequisition(false)}
      >
        <RequisitionView
          requisition={selectedRequisition}
          mode={modes.VIEW}
          onEdit={() => {
            setShowRequisition(false);
            setShowUpdateRequisition(true);
          }}
          onSuccess={() => {
            setShowRequisition(false);
            handleGetRequisitions({ skip: 0, take: pageSize });
          }}
        />
      </Modal>

      {/*EDIT REQUISITION*/}
      <Modal
        open={showUpdateRequisition}
        title="Actualizar Requisición"
        onClose={() => setShowUpdateRequisition(false)}
      >
        <UpdateRequisitionForm
          requisitionId={selectedRequisition?.id}
          onSuccess={() => {
            setShowUpdateRequisition(false);
            handleGetRequisitions({ skip: 0, take: pageSize });
          }}
        />
      </Modal>
    </>
  );
}
