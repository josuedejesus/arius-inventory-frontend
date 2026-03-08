"use client";

import Modal from "@/app/components/Modal";
import NewUnitForm from "@/app/components/create-forms/NewUnitForm";
import SearchBar from "@/app/components/SearchBar";
import UpdateUnitForm from "@/app/dashboard/units/components/UnitForm";
import UnitCard from "@/app/components/cards/UnitCard";
import axios from "axios";
import { useEffect, useState } from "react";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";

const columns: ColumnDef<any>[] = [
  { key: "name", title: "Nombre" },
  { key: "code", title: "Codigo" },
];

export default function Units() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Units
  const [units, setUnits] = useState<any>([]);

  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredUnits = units.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.unitname} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  //Update Unit
  const [showUnitForm, setShowUnitForm] = useState<boolean>(false);

  const handleGetUnits = () => {
    axios
      .get(`${apiUrl}/units`)
      .then((response) => {
        console.log(response);
        setUnits(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    handleGetUnits();
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-between space-x-2 pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Unidades</h1>

        <button
          onClick={() => setShowUnitForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      <DataGrid<any>
        columns={columns}
        rows={units}
        gridTemplate="2fr 2fr" // ← mismo que tu card
        searchKeys={["name", "code"]}
        renderCard={(row) => (
          <UnitCard
            onClick={(unit: any) => {
              setSelectedUnit(unit);
              setShowUnitForm(true);
            }}
            key={row.id}
            unit={row}
          />
        )}
      />
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
