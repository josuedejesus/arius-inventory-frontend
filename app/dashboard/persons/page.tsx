"use client";

import Modal from "@/app/components/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PersonsForm from "./components/PersonsForm";
import LoadingScreen from "@/app/components/LoadingScreen";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { PersonViewModel } from "./types/person-view-model";
import { PERSON_ROLE_LABELS } from "@/constants/PersonRoles";
import { formatDate } from "@/app/utils/formatters";
import SearchBar from "@/app/components/SearchBar";

export default function Persons() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Persons
  const [persons, setPersons] = useState<any>([]);

  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  const filteredPersons = persons.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.personname} ${u.username} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const handleGetPersons = async () => {
    try {
      setloading(true);
      const response = await axios.get(`${apiUrl}/persons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setPersons(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    handleGetPersons();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Personas</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <SearchBar placeholder="Buscar persona..." value={searchValue} onChange={(e: any) => setSearchValue(e)} />
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      <PagedDataGrid
        data={filteredPersons}
        total={filteredPersons?.length}
        pageSize={1}
        page={1}
        pagination={false}
        onLoadData={handleGetPersons}
        onRowClick={(row: PersonViewModel) => {
          setSelectedPerson(row);
          setShowForm(true);
        }}
      >
        <PagedDataGrid.Column field="name" title="Nombre">
          {(row: PersonViewModel) => (
            <span className="text-gray-600">{row.name}</span>
          )}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="username" title="Usuario">
          {(row: PersonViewModel) => (
            <span className="text-gray-600">{row.username}</span>
          )}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="contact" title="Contacto">
          {(row: PersonViewModel) => (
            <div className="flex flex-col">
              <span className="text-gray-600">{row.email}</span>
              <span className="text-gray-600">{row.phone}</span>
            </div>
          )}
        </PagedDataGrid.Column>
        <PagedDataGrid.Column field="type" title="Tipo">
          {(row: PersonViewModel) => (
            <span className="text-gray-600">
              {PERSON_ROLE_LABELS[row.role]}
            </span>
          )}
        </PagedDataGrid.Column>

        <PagedDataGrid.Column field="updated_at" title="Actualizado">
          {(row: PersonViewModel) => (
            <span className="text-gray-500 text-xs">
              {row.updated_at ? formatDate(row.updated_at) : "-"}
            </span>
          )}
        </PagedDataGrid.Column>
      </PagedDataGrid>

      {/*PERSON FORM*/}
      <Modal
        open={showForm}
        title="Actualizar Persona"
        onClose={() => {
          setShowForm(false);
          setSelectedPerson(undefined);
        }}
      >
        <PersonsForm
          personId={selectedPerson?.id}
          onSuccess={() => {
            setShowForm(false);
            handleGetPersons();
            setSelectedPerson(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
