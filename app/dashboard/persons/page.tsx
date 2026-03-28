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
import { MdWarning } from "react-icons/md";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import { PrimaryBadge } from "@/app/components/badges/PrimaryBadge";
import PermissionGuard from "@/app/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/app/lib/auth/permissions";

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
      console.log("response", response);

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
    <PermissionGuard permission={PERMISSIONS.VIEW_USERS}>
      <div className="">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Personas
          </h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <SearchBar
            placeholder="Buscar persona..."
            value={searchValue}
            onChange={(e: any) => setSearchValue(e)}
          />
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
              <span className="font-semibold text-gray-800">{row?.name}</span>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="username" title="Usuario">
            {(row: PersonViewModel) => (
              <span className="font-semibold text-blue-400">
                {row.username}
              </span>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="contact" title="Contacto">
            {(row: PersonViewModel) => (
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-gray-800">
                  {row.email}
                </span>
                <span className="text-xs text-gray-400">
                  {row.phone || "Sin teléfono"}
                </span>
              </div>
            )}
          </PagedDataGrid.Column>
          <PagedDataGrid.Column field="type" title="Tipo">
            {(row: PersonViewModel) => (
              <PrimaryBadge label={PERSON_ROLE_LABELS[row.role]} />
            )}
          </PagedDataGrid.Column>

          <PagedDataGrid.Column field="location_count" title="Ubicaciones">
            {(row: PersonViewModel) => (
              <BooleanBadge
                value={row.location_count > 0}
                trueLabel={row.location_count.toString()}
                falseIcon={<MdWarning className="text-red-400" />}
              />
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
    </PermissionGuard>
  );
}
