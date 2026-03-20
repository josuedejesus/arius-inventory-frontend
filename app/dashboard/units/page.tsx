"use client";

import Modal from "@/app/components/Modal";
import NewUnitForm from "@/app/components/create-forms/NewUnitForm";
import SearchBar from "@/app/components/SearchBar";
import UpdateUnitForm from "@/app/dashboard/units/components/UnitForm";
import UnitCard from "@/app/components/cards/UnitCard";
import axios from "axios";
import { useEffect, useState } from "react";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";
import { set } from "date-fns";
import LoadingScreen from "@/app/components/LoadingScreen";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { UnitViewModel } from "./types/unit-view.model";

const columns: ColumnDef<any>[] = [
  { key: "name", title: "Nombre" },
  { key: "code", title: "Codigo" },
];

export default function Units() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [units, setUnits] = useState<any>([]);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [showUnitForm, setShowUnitForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetUnits = async () => {
    try {
      const response = await axios.get(`${apiUrl}/units`);
      setUnits(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetUnits();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
      <div className="flex items-start justify-between space-x-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Unidades</h1>

        <button
          onClick={() => setShowUnitForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      <PagedDataGrid
        data={units}
        page={1}
        pageSize={1}
        total={units?.length}
        onLoadData={handleGetUnits}
        onRowClick={(row: UnitViewModel) => {
          setSelectedUnit(row);
          setShowUnitForm(true);
        }}
        pagination={false}
      >
        <PagedDataGrid.Column field="name" title="Nombre">
          {(row: UnitViewModel) => <span>{row?.name}</span>}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="code" title="Código">
          {(row: UnitViewModel) => <span>{row?.code}</span>}
        </PagedDataGrid.Column>
      </PagedDataGrid>

      {/*UNIT FORM*/}
      <Modal
        open={showUnitForm}
        title="Unidad"
        onClose={() => {
          setSelectedUnit(undefined);
          setShowUnitForm(false);
        }}
      >
        <UpdateUnitForm
          unitId={selectedUnit?.id}
          onSuccess={() => {
            setSelectedUnit(undefined);
            setShowUnitForm(false);
            handleGetUnits();
          }}
        />
      </Modal>
    </div>
  );
}
