"use client";

import Modal from "@/app/components/Modal";
import SearchBar from "@/app/components/SearchBar";
import ItemCard from "@/app/dashboard/items/components/ItemCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";
import ItemForm from "@/app/dashboard/items/components/ItemForm";
import LoadingScreen from "@/app/components/LoadingScreen";

const columns: ColumnDef<any>[] = [
  { key: "name", title: "Articulo" },
  { key: "model", title: "Modelo" },
  { key: "brand", title: "Marca" },
  { key: "status", title: "Estado" },
];

export default function Items() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [item, setItem] = useState<any>(undefined);
  const [showItemForm, setShowItemForm] = useState<boolean>(false);
  //Items
  const [items, setItems] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetItems = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setItems(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetItems();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
      <div className="flex items-start justify-between space-x-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Articulos</h1>

        <button
          onClick={() => setShowItemForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      <DataGrid<any>
        columns={columns}
        rows={items}
        gridTemplate="15fr 10fr 10fr 2fr" // ← mismo que tu card
        searchKeys={["name", "model", "brand", "status"]}
        renderCard={(row) => (
          <ItemCard
            onClick={(item: any) => {
              setSelectedItem(item);
              setShowItemForm(true);
            }}
            key={row.id}
            item={row}
          />
        )}
      />

      <Modal
        open={showItemForm}
        title="Articulo"
        onClose={() => {
          setShowItemForm(false);
          setSelectedItem(undefined);
        }}
      >
        <ItemForm
          itemId={selectedItem?.id}
          onSuccess={() => {
            setSelectedItem(undefined);
            setShowItemForm(false);
            handleGetItems();
          }}
        />
      </Modal>
    </div>
  );
}
