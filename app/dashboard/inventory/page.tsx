"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Tab from "@/app/components/Tab";
import SearchBar from "@/app/components/SearchBar";
import InventoryLocationCard from "@/app/components/cards/InventoryLocationCard";
import Modal from "@/app/components/Modal";
import LocationInventory from "@/app/components/LocationInventory";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import InventoryItemView from "@/app/components/views/InventoryItemView";
import InventoryItem from "@/app/components/cards/InventoryItem";
import InventoryUnitView from "@/app/components/views/InventoryUnitView";
export default function Warehouses() {
  const [view, setView] = useState<"LOCATIONS" | "ITEMS" | "MOVEMENTS">(
    "LOCATIONS",
  );

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const user = useAuth();

  //Data
  const [locations, setLocations] = useState<any>([]);
  const [items, setItems] = useState<any>([]);

  //Selected
  const [selectedWarehouse, setSelectedWarehouse] = useState<any | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  //Modals
  const [showSelectedUnit, setShowSelectedUnit] = useState<boolean>(false);
  const [showSelectedItem, setShowSelectedItem] = useState<boolean>(false);

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredWarehouses = locations.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.warehousename} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  //New Warehouse
  const [showNewWarehouse, setShowNewWarehouse] = useState<boolean>(false);

  //Update Warehouse
  const [showUpdateWarehouse, setShowUpdateWarehouse] =
    useState<boolean>(false);

  const handleGetLocations = () => {
    axios
      .get(`${apiUrl}/locations/get-locations-with-inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        setLocations(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const handleGetItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data.data);
      setItems(response.data.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    if (view === "LOCATIONS") {
      handleGetLocations();
    }

    if (view === "ITEMS") {
      handleGetItems();
    }
  }, [view]);

  const handleUpdateWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setShowUpdateWarehouse(true);
  };

  

  const handleSelectItem = (item: any) => {
    setSelectedItem(item?.id);
    setShowSelectedItem(true);
  }

  function InventoryByItem() {
    return (
      <div className="space-y-4">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Buscar ítems..."
        />
        <div className="columns-1 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <InventoryItem
                key={item.id}
                item={item}
                location={null}
                onClick={handleSelectItem}
              />
            </div>
          ))}
        </div>

        <Modal
          open={showSelectedItem}
          title="Articulo"
          onClose={() => setShowSelectedItem(false)}
        >
          <InventoryItemView itemId={selectedItem}/>
        </Modal>
      </div>
    );
  }

  function InventoryByLocation() {
    return (
      <>
        <div className="flex items-center justify-between space-x-2 pb-4">
          {" "}
          <SearchBar
            value={searchValue}
            placeholder="Buscar ubicaciones..."
            onChange={setSearchValue}
          />{" "}
        </div>{" "}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {" "}
          {filteredWarehouses.map((u: any, index: number) => (
            <InventoryLocationCard
              onClick={handleUpdateWarehouse}
              key={u.id}
              location={u}
            />
          ))}{" "}
        </div>
        <Modal
          open={showUpdateWarehouse}
          title="Inventario por Ubicación"
          onClose={() => setShowUpdateWarehouse(false)}
        >
          {" "}
          <LocationInventory location={selectedWarehouse} />{" "}
        </Modal>
      </>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Inventario</h1>

      {/* TABS */}
      <div className="flex gap-2 border-b mb-6">
        <Tab
          label="Por Ubicación"
          active={view === "LOCATIONS"}
          onClick={() => setView("LOCATIONS")}
        />
        <Tab
          label="Por Articulo"
          active={view === "ITEMS"}
          onClick={() => setView("ITEMS")}
        />
      </div>

      {/* CONTENIDO */}
      {view === "LOCATIONS" && <InventoryByLocation />}
      {view === "ITEMS" && <InventoryByItem />}
    </div>
  );
}
