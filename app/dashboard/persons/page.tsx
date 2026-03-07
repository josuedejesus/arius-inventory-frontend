"use client";

import Modal from "@/app/components/Modal";
import NewPersonForm from "@/app/dashboard/persons/components/NewPersonForm";
import SearchBar from "@/app/components/SearchBar";
import UpdatePersonForm from "@/app/dashboard/persons/components/UpdatePersonForm";
import PersonCard from "@/app/components/cards/PersonCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DataGrid, { ColumnDef } from "@/app/components/DataGrid";
import PersonsForm from "./components/PersonsForm";

const columns: ColumnDef<any>[] = [
  { key: "name", title: "Nombre" },
  { key: "username", title: "Usuario" },
  { key: "contact", title: "Contacto" },
  { key: "type", title: "Tipo" },
  { key: "updated_at", title: "Ultima Actualizacion" },
];

export default function Persons() {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  //Persons
  const [persons, setPersons] = useState<any>([]);

  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);

  //SearchBar
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredPersons = persons.filter((u: any) =>
    `${u.name} ${u.lastname} ${u.personname} ${u.email} ${u.phone}`
      .toLowerCase()
      .includes(searchValue.toLowerCase()),
  );

  const [showForm, setShowForm] = useState<boolean>(false);

  //New Person
  const [showNewPerson, setShowNewPerson] = useState<boolean>(false);

  //Update Person
  const [showUpdatePerson, setShowUpdatePerson] = useState<boolean>(false);

  const handleGetPersons = async () => {
    try {
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
    }
  };

  useEffect(() => {
    handleGetPersons();
  }, []);

  const handleUpdatePerson = (person: any) => {
    console.log(person);
    setSelectedPerson(person);
    setShowUpdatePerson(true);
  };

  return (
    <div className="">
      <div className="flex items-start justify-between pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Personas</h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                     hover:bg-blue-500 transition text-sm font-medium"
        >
          <span className="text-lg">＋</span>
        </button>
      </div>

      {/*<Modal
        open={showNewPerson}
        title="Nueva Persona"
        onClose={() => setShowNewPerson(false)}
      >
        <NewPersonForm
          onSuccess={() => {
            setShowNewPerson(false);
            handleGetPersons();
          }}
        />
      </Modal>*/}

      {/*<Modal
        open={showUpdatePerson}
        title="Actualizar Persona"
        onClose={() => setShowUpdatePerson(false)}
      >
        <UpdatePersonForm
          person={selectedPerson}
          onSuccess={() => {
            setShowUpdatePerson(false);
            handleGetPersons();
          }}
        />
      </Modal>*/}

      <Modal
        open={showForm}
        title="Actualizar Persona"
        onClose={() => {setShowForm(false); setSelectedPerson(undefined)}}
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

      <DataGrid<any>
        columns={columns}
        rows={persons}
        gridTemplate="2fr 2fr 3fr 1.5fr 1fr" // ← mismo que tu card
        searchKeys={["name", "username", "email", "phone"]}
        renderCard={(row) => (
          <PersonCard
            onClick={(person: any) => {
              setSelectedPerson(person);
              setShowForm(true);
            }}
            key={row.id}
            person={row}
          />
        )}
      />
    </div>
  );
}
