"use client";

import Modal from "@/app/components/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import ItemForm from "@/app/dashboard/items/components/ItemForm";
import LoadingScreen from "@/app/components/LoadingScreen";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { ITEM_TYPE_LABELS } from "@/constants/ItemTypeConfig";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import PermissionGuard from "@/app/components/guards/PermissionGuard";
import { ItemUnitViewModel } from "@/app/types/item/item-unit-view.model";
import { ItemViewModel } from "@/app/types/item/item-view.model";
import { ItemType } from "@/app/types/item/item-type.enum";
import SearchBar from "@/app/components/SearchBar";

export default function Items() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [showItemForm, setShowItemForm] = useState<boolean>(false);
  const [items, setItems] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredItems = items.filter((u: any) =>
    `${u.name} ${u.brand} ${u.model} ${ITEM_TYPE_LABELS[u.type as ItemType]?.label}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

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
    <PermissionGuard permission="VIEW_ITEMS">
      <div className="">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Personas
          </h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <SearchBar
            placeholder="Buscar artículo..."
            value={searchValue}
            onChange={(e: any) => setSearchValue(e)}
          />
          <button
            onClick={() => setShowItemForm(true)}
            className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                             hover:bg-blue-500 transition text-sm font-medium"
          >
            <span className="text-lg">＋</span>
          </button>
        </div>

        <PagedDataGrid
          data={filteredItems}
          page={1}
          pageSize={1}
          total={filteredItems?.length}
          pagination={false}
          onLoadData={handleGetItems}
          onRowClick={(row: ItemUnitViewModel) => {
            setSelectedItem(row);
            setShowItemForm(true);
          }}
        >
          <PagedDataGrid.Column field="name" title="Articulo">
            {(row: ItemViewModel) => (
              <span className="font-semibold text-gray-700">{row?.name}</span>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="brand" title="Marca">
            {(row: ItemViewModel) => (
              <span className="text-xs text-gray-700">{row?.brand}</span>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="model" title="Modelo">
            {(row: ItemViewModel) => (
              <span className="text-xs text-gray-700">{row?.model}</span>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="type" title="Tipo">
            {(row: ItemViewModel) => {
              const typeConfig = ITEM_TYPE_LABELS[row?.type as ItemType];
              return (
                <PrimaryBadge
                  label={typeConfig?.label}
                  icon={typeConfig?.icon ? <typeConfig.icon /> : undefined}
                />
              );
            }}
          </PagedDataGrid.Column>
        </PagedDataGrid>

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
    </PermissionGuard>
  );
}
