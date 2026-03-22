"use client";

import Modal from "@/app/components/Modal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useSSE } from "@/hooks/userSSE";
import RequisitionView from "@/app/dashboard/requisitions/components/RequisitionView";
import { useRequisitions } from "@/hooks/useRequisitions";
import LoadingScreen from "@/app/components/LoadingScreen";
import { RequisitionViewModel } from "./types/requisition-view.model";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { RETURN_STATUS_CONFIG } from "@/constants/ReturnStatusConfig";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { REQUISITION_STATUS_CONFIG } from "@/constants/RequisitionStatus";
import RequisitionForm from "./components/RequisitionForm";
import axios from "axios";
import { LocationViewModel } from "../locations/types/location-view-model";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(18);
  const [total, setTotal] = useState(0);
  const [requisitions, setRequisitions] = useState<any>([]);
  const [selectedRequisition, setSelectedRequisition] = useState<any | null>(
    null,
  );
  const [showNewRequisition, setShowNewRequisition] = useState<boolean>(false);
  const [showRequisition, setShowRequisition] = useState<boolean>(false);
  useState<boolean>(false);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);

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

  const handleGetLocations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setLocations(response.data.data);
    } catch (error: any) {
      toast.error("Error obteniendo ubicaciones");
    }
  };

  useSSE({
    "requisition.created": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Nueva requisición creada");
    },
    "requisition.approved": () => {
      handleGetRequisitions({ skip: (page - 1) * pageSize, take: pageSize });
      toast.info("Una requisición fue aprobada");
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
            onClick={() => {
              setShowNewRequisition(true);
              handleGetLocations();
            }}
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
              <span className="text-gray-600">{row.id}</span>
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="type" title="Tipo">
            {(row: RequisitionViewModel) => (
              <span className="text-gray-600">
                {REQUISITION_TYPE_CONFIG[row.type].label}
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
                label={REQUISITION_STATUS_CONFIG[row.status].label}
                variant={`${REQUISITION_STATUS_CONFIG[row.status].className}`}
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
        <RequisitionForm
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
          }}
          onSuccess={() => {
            setShowRequisition(false);
            handleGetRequisitions({ skip: 0, take: pageSize });
          }}
        />
      </Modal>
    </>
  );
}
