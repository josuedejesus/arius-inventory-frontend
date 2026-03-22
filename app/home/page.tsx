"use client";  // agrega esto en la primera línea
import axios from "axios";
import ClientDashboard from "./components/ClientDashboard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { LocationViewModel } from "../dashboard/locations/types/location-view-model";
import Modal from "../components/Modal";
import { ItemUnitStatus } from "../components/item-units/types/item-units-status.enum";
import { ItemUnitViewModel } from "../dashboard/items/types/item-unit-view.model";
import RequisitionForm from "../dashboard/requisitions/components/RequisitionForm";
import { RequisitionType } from "../dashboard/requisitions/types/requisition-type.enum";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const user = useAuth().user;

  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const [activeLocation, setActiveLocation] = useState<LocationViewModel>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [itemUnits, setItemUnits] = useState<ItemUnitViewModel[]>([]);
  const [requisitionType, setRequisitionType] = useState<
    RequisitionType | undefined
  >(undefined);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([handleGetLocations(), handleGetItemUnitStats()]);
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

  const handleGetItemUnits = async (filters: any) => {
    try {
      const response = await axios.get(`${apiUrl}/item-units`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        params: filters,
      });

      setItemUnits(response.data.data);
    } catch (error) {
      toast.error("Error obteniendo artículos");
    }
  };

  return (
    <>
      <ClientDashboard
        client_name="Cliente Ejemplo"
        locations={locations}
        activeLocation={activeLocation!}
        onChangeLocation={setActiveLocation}
        summary={{ pending: 0, in_progress: 0, rented: 0, due_soon: 0 }}
        recent_orders={[]}
        rented_items={[]}
        onNewEquipmentOrder={() => {
          setShowForm(true);
          setRequisitionType(RequisitionType.RENT);
          handleGetItemUnits({ status: ItemUnitStatus.AVAILABLE });
        }}
        onNewMaterialOrder={() => {
          setShowForm(true);
          setRequisitionType(RequisitionType.CONSUMPTION);
          handleGetItemUnits({ status: ItemUnitStatus.AVAILABLE });
        }}
        onReturn={() => {
          setShowForm(true);
          setRequisitionType(RequisitionType.RETURN);
          handleGetItemUnits({
            status: ItemUnitStatus.RENTED,
            locationId: activeLocation?.id,
          });
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
          type={requisitionType}
          onSuccess={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}
