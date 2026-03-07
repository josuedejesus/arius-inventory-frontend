"use client";

import Modal from "@/app/components/Modal";
import SearchBar from "@/app/components/SearchBar";
import WarehouseCard from "@/app/dashboard/locations/components/LocationCard";
import axios from "axios";
import { useEffect, useState } from "react";
import UpdateLocationForm from "@/app/dashboard/locations/components/UpdateLocationForm";
import NewLocationForm from "@/app/components/create-forms/NewLocationForm";
import LocationCard from "@/app/dashboard/locations/components/LocationCard";
import { toast } from "sonner";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";

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

  const filteredWarehouses = warehouses.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.warehousename} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  //New Warehouse
  const [showNewWarehouse, setShowNewWarehouse] = useState<boolean>(false);
  const [showLocationForm, setShowLocationForm] = useState<boolean>(false);
  //Update Warehouse
  const [showUpdateWarehouse, setShowUpdateWarehouse] =
    useState<boolean>(false);

  const handleGetWarehouses = async () => {
    try {
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
    }
  };

  useEffect(() => {
    handleGetWarehouses();
  }, []);

  return (
    <div className="">
      <div className="flex items-start justify-between space-x-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Ubicaciones
        </h1>

        <button
          onClick={() => setShowLocationForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      {/*<Modal
        open={showNewWarehouse}
        title="Nueva  Ubicacion"
        onClose={() => setShowNewWarehouse(false)}
      >
        <NewLocationForm
          onSuccess={() => {
            setShowNewWarehouse(false);
            handleGetWarehouses();
          }}
        />
      </Modal>*/}

      <DataGrid<any>
        columns={columns}
        rows={warehouses}
        gridTemplate="3fr 2fr 4fr 2fr" // ← mismo que tu card
        searchKeys={["name", "type", "location", "status"]}
        renderCard={(row) => (
          <LocationCard
            onClick={(location: any) => {
              console.log(location);
              setSelectedWarehouse(location);
              setShowLocationForm(true);
            }}
            key={row.id}
            location={row}
          />
        )}
      />

      <Modal
        open={showLocationForm}
        title="Actualizar Ubicacion"
        onClose={() => {setShowLocationForm(false); setSelectedWarehouse(undefined);}}
      >
        <UpdateLocationForm
          locationId={selectedWarehouse?.id}
          onSuccess={() => {
            setSelectedWarehouse(undefined);
            setShowLocationForm(false);
            handleGetWarehouses();
          }}
        />
      </Modal>
    </div>
  );
}
