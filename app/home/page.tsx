"use client"; // agrega esto en la primera línea
import axios from "axios";
import ClientDashboard from "./components/ClientDashboard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LocationViewModel } from "../dashboard/locations/types/location-view-model";
import Modal from "../components/Modal";
import { ItemUnitStatus } from "../components/item-units/types/item-units-status.enum";
import RequisitionForm from "../dashboard/requisitions/forms/RequisitionForm";
import { RequisitionType } from "../dashboard/requisitions/types/requisition-type.enum";
import PermissionGuard from "../components/guards/PermissionGuard";
import { PERMISSIONS } from "../lib/auth/permissions";
import { MovementType } from "../dashboard/requisitions/types/movement-type";
import { ItemUnitViewModel } from "../types/item/item-unit-view.model";
import { RequisitionViewModel } from "../dashboard/requisitions/dto/requisition-view-model.dto";

type SummaryDto = {
  totalItemUnits: number;
  totalActiveLocations: number;
  pending: number;
  inProgress: number;
  rented: number;
  dueSoon: number;
};
export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = useAuth().user;

  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationViewModel>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [itemUnits, setItemUnits] = useState<ItemUnitViewModel[]>([]);
  const [requisitions, setRequisitions] = useState<RequisitionViewModel[]>([]);
  const [requisitionType, setRequisitionType] = useState<
    RequisitionType | undefined
  >(undefined);
  const [movementType, setMovementType] = useState<MovementType | undefined>(
    undefined,
  );
  const [summary, setSummary] = useState<SummaryDto | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([
        handleGetDashboardData(),
        handleGetLocations(),
        handleGetItemUnitStats(),
        handleGetRentedItems(),
        handleGetRequisitions(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGetLocations = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/locations/${user?.user_id}/user`,
      );

      console.log(response.data);
      setLocations(response.data);
      setActiveLocation(response.data[0]);
    } catch (error) {
      toast.error("Error obteniendo ubicaciones");
    }
  };

  const handleGetItemUnitStats = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/${user?.user_id}/status-stats-by-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      console.log(response.data);
    } catch (error) {
      toast.error("Error obteniendo estadísticas");
    }
  };

  const handleGetDashboardData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/summary/external`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data);
      setSummary(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetRentedItems = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/${user?.user_id}/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setItemUnits(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Error obteniendo artículos rentados";
      toast.error(message);
    }
  };

  const handleGetRequisitions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/requisitions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("requisitions", response.data);
      setRequisitions(response.data.items);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? "Error obteniendo artículos rentados";
      toast.error(message);
    }
  };
  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_HOME}>
      <ClientDashboard
        client_name="Cliente Ejemplo"
        locations={locations}
        activeLocation={activeLocation!}
        onChangeLocation={setActiveLocation}
        summary={{
          total_item_units: summary?.totalItemUnits || 0,
          active_locations: summary?.totalActiveLocations || 0,
          pending: summary?.pending || 0,
          in_progress: summary?.inProgress || 0,
          rented: summary?.rented || 0,
          due_soon: summary?.dueSoon || 0,
        }}
        recent_orders={requisitions}
        rented_items={itemUnits}
        onNewEquipmentOrder={() => {
          setShowForm(true);
          setMovementType(MovementType.OUT);
          setRequisitionType(RequisitionType.RENT);
        }}
        onNewMaterialOrder={() => {
          setShowForm(true);
          setMovementType(MovementType.OUT);
          setRequisitionType(RequisitionType.CONSUMPTION);
        }}
        onReturn={() => {
          setShowForm(true);
          setMovementType(MovementType.IN);
          console.log(movementType);
          setRequisitionType(RequisitionType.RETURN);
        }}
        onViewHistory={() => {}}
        onViewAllOrders={() => {}}
        onViewAllItems={() => {}}
      />
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={
          requisitionType === RequisitionType.RENT
            ? "Nueva orden de equipo"
            : requisitionType === RequisitionType.CONSUMPTION
              ? "Nueva orden de material"
              : "Nueva orden de devolución"
        }
      >
        <RequisitionForm
          movement={movementType}
          type={requisitionType}
          userLocations={locations}
          onSuccess={() => setShowForm(false)}
        />
      </Modal>
    </PermissionGuard>
  );
}
