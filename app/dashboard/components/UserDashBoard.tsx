import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import MinimalItemUnitCard from "@/app/dashboard/items/cards/MinimalItemUnitCard";
import { LocationViewModel } from "@/app/dashboard/locations/types/location-view-model";
import MinimalPersonCard from "@/app/dashboard/persons/components/MinimalPersonCard";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import { PERSON_ROLE_LABELS } from "@/constants/PersonRoles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdCategory,
  MdInventory,
  MdLocationOn,
  MdMail,
  MdPeople,
  MdPerson,
  MdPhone,
} from "react-icons/md";
import { toast } from "sonner";
import MinimalLocationCard from "../locations/cards/MinimalLocationCard";
import { PersonViewModel } from "../persons/types/person-view-model";


type Props = {
  personId: number;
  userId: number;
};

export default function UserDashboard({ personId, userId }: Props) {
  const [person, setPerson] = useState<PersonViewModel>();
  const [locations, setLocations] = useState<any[]>([]);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([
        handleGetPerson(),
        handleGetLocations(),
        handleGetItemUnits(),
      ]);
    };
    fetchData();
  }, [personId, userId]);

  const handleGetPerson = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/persons/${personId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setPerson(response.data.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleGetLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/locations/${userId}/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setLocations(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetItemUnits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/item-units/${userId}/user`, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setItemUnits(response.data);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const skeleton = [1, 2, 3].map((i) => (
    <div
      key={i}
      className="animate-pulse flex justify-between items-center p-2 border rounded-lg"
    >
      <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
    </div>
  ));

  if (loading) {
    return skeleton;
  }

  return (
    <div className="space-y-6">
      {/* 🔷 HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div className="space-y-1">
          {/* 🔷 Nombre + rol */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-gray-800">
              {person?.name}
            </h1>

            {person?.role && (
              <PrimaryBadge
                label={PERSON_ROLE_LABELS[person.role]}
                className="default"
              />
            )}
          </div>

          {/* 📧 Contacto */}
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            {person?.email && (
              <span className="flex items-center gap-1">
                <MdMail /> {person.email}
              </span>
            )}

            {person?.phone && (
              <span className="flex items-center gap-1">
                <MdPhone /> {person.phone}
              </span>
            )}
          </div>

          {/* 📍 Dirección */}
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MdLocationOn className="text-blue-400" />
            {person?.address || "Sin dirección"}
          </p>
        </div>
      </div>

      {/* 🔷 KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard title="Ubicaciones" value={locations?.length || 0} />
        <KpiCard title="Equipos" value={itemUnits?.length || 0} />
      </div>

      {/* 🔷 GRID PRINCIPAL */}
      <div className="grid sm:grid-cols-1  gap-6">
        {/* 👥 STAFF */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="flex items-center font-semibold text-gray-600 mb-3">
            <MdLocationOn className="inline-block mr-2" />
            Ubicaciones asignadas
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {locations?.length ? (
              locations.map((l) => <MinimalLocationCard key={l.id} location={l} />)
            ) : (
              <p className="text-sm text-gray-400">Sin ubicaciones asignadas</p>
            )}
          </div>
        </div>

        {/* 📦 ITEM UNITS */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="flex items-center font-semibold text-gray-600 mb-3">
            <MdInventory className="inline-block mr-2" />
            Equipos asignados
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {itemUnits?.length ? (
              itemUnits.map((iu) => (
                <MinimalItemUnitCard key={iu.id} itemUnit={iu} />
              ))
            ) : (
              <p className="text-sm text-gray-400">Sin equipos asignados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const KpiCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold text-gray-800">{value}</p>
  </div>
);
