"use client";

import Modal from "@/app/components/Modal";
import SearchBar from "@/app/components/SearchBar";
import RequisitionCard from "@/app/components/cards/RequisitionCard";
import axios from "axios";
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

const columns: ColumnDef<any>[] = [
  { key: "requisition", title: "Requisition" },
  { key: "movements", title: "Movimiento" },
  { key: "status", title: "Estado" },
  { key: "returned", title: "Retornado" },
];

enum modes {
  VIEW,
  EDIT,
  APPROVE,
  EXECUTE,
  RECEIVE,
}

const ACTIONS_BY_ROLE = {
  OPERATOR: ["EDIT", "CREATE", "EXECUTE"],
  MANAGER: ["APPROVE"],
  ADMIN: ["ALL", "APPROVE"],
};

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
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //User
  const { user } = useAuth();

  const [mode, setMode] = useState<modes>(modes.VIEW);

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

  //Requisition Accessories
  const [requisitionAccessories, setRequisitionAccessories] = useState<any[]>(
    [],
  );

  const { getAll: getRequisitions, loading } = useRequisitions();

  //Requisitions

  const handleGetRequisitions = async () => {
    const { data } = await getRequisitions();
    setRequisitions(data);
  };

  useEffect(() => {
    handleGetRequisitions();
  }, []);

  useSSE({
    "requisition.created": () => {
      handleGetRequisitions();
      toast.info("Nueva requisición creada");
    },
    "requisition.approved": () => {
      handleGetRequisitions();
      toast.info("Una requisición fue aprovada");
    },
    "requisition.executed": () => {
      handleGetRequisitions();
      toast.info("Una requisición fue ejecutada");
    },
    "requisition.received": () => {
      handleGetRequisitions();
      toast.info("Una requisición fue recibida");
    },
  });

  const handleViewRequisition = (requisition: any) => {
    const role = user?.user_role;
    const status = requisition?.status;

    const nextMode = VIEW_MODE_BY_ROLE_STATUS[role!]?.[status] ?? modes.VIEW;

    setSelectedRequisition(requisition);
    setMode(nextMode);
    setShowRequisition(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Requisiciones
        </h1>

        <div className="flex requisitions-center justify-between space-x-2 pb-4">
          <SearchBar
            value={searchValue}
            placeholder="Buscar requisiciones..."
            onChange={setSearchValue}
          />

          <button
            onClick={() => setShowNewRequisition(true)}
            className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
          >
            <span className="text-lg">＋</span>
          </button>
        </div>

        <DataGrid<any>
          columns={columns}
          rows={filteredRequisitions}
          gridTemplate="3fr 4fr 2fr 2fr" // ← mismo que tu card
          searchKeys={[
            "type",
            "status",
            "location",
            "requestor",
            "source_location_name",
            "detination_location_name",
          ]}
          renderCard={(row) => (
            <RequisitionCard
              onClick={handleViewRequisition}
              key={row.id}
              requisition={row}
            />
          )}
        />
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
            handleGetRequisitions();
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
            handleGetRequisitions();
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
            handleGetRequisitions();
          }}
        />
      </Modal>
    </>
  );
}
