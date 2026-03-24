"use client";

import Modal from "@/app/components/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import LocationCard from "@/app/dashboard/locations/components/LocationCard";
import { toast } from "sonner";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";
import LoadingScreen from "@/app/components/LoadingScreen";
import LocationForm from "@/app/dashboard/locations/components/LocationForm";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { LocationViewModel } from "./types/location-view-model";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import { LOCATION_TYPE_CONFIG } from "@/constants/LocationTypeConfig";
import SearchBar from "@/app/components/SearchBar";
import { MdWarning } from "react-icons/md";

const columns: ColumnDef<any>[] = [
  { key: "name", title: "Nombre" },
  { key: "type", title: "Tipo" },
  { key: "location", title: "Ubicacion" },
  { key: "status", title: "Estado" },
];

export default function Warehouses() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Warehouses
  const [warehouses, setWarehouses] = useState<any>([]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [showLocationForm, setShowLocationForm] = useState<boolean>(false);

  const filteredWarehouses = warehouses.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.personname} ${u.username} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const handleGetLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/locations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setWarehouses(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetLocations();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Ubicaciones
        </h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <SearchBar
          placeholder="Buscar ubicación..."
          value={searchValue}
          onChange={(e: any) => setSearchValue(e)}
        />
        <button
          onClick={() => setShowLocationForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                           hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      <PagedDataGrid
        data={warehouses}
        page={1}
        pageSize={1}
        total={warehouses?.length}
        onLoadData={handleGetLocations}
        pagination={false}
        onRowClick={(row: LocationViewModel) => {
          setSelectedWarehouse(row);
          setShowLocationForm(true);
        }}
      >
        <PagedDataGrid.Column field="name" title="Nombre">
          {(row: LocationViewModel) => <span>{row?.name}</span>}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="type" title="Tipo">
          {(row: LocationViewModel) => {
            const typeConfig = LOCATION_TYPE_CONFIG[row?.type];
            return (
              <span className="flex items-center justify-start gap-2">
                {typeConfig?.icon && (
                  <typeConfig.icon color={typeConfig.className} />
                )}{" "}
                {typeConfig?.label}
              </span>
            );
          }}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="address" title="Dirección">
          {(row: LocationViewModel) => <span>{row?.location}</span>}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="location_count" title="Ubicaciones">
          {(row: LocationViewModel) => (
            <div className=" flex items-center justify-center gap-1">
              {row.member_count > 0 ? (
                <span className="text-gray-600">{row.member_count}</span>
              ) : (
                <span className="text-gray-400 flex items-center gap-1">
                  {" "}
                  <MdWarning className="text-red-400" />
                </span>
              )}
            </div>
          )}
        </PagedDataGrid.Column>
      </PagedDataGrid>

      {/*LOCATION FORM*/}
      <Modal
        open={showLocationForm}
        title="Ubicación"
        onClose={() => {
          setShowLocationForm(false);
          setSelectedWarehouse(undefined);
        }}
      >
        <LocationForm
          locationId={selectedWarehouse?.id}
          onSuccess={() => {
            setSelectedWarehouse(undefined);
            setShowLocationForm(false);
            handleGetLocations();
          }}
        />
      </Modal>
    </div>
  );
}
