"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import { useAuth } from "@/context/AuthContext";
import FormSection from "../../../components/form/FormSection";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import FormText from "../../../components/form/FormText";
import RequisitionHeader from "./RequisitionHeader";
import FormDate from "../../../components/form/FormDate";
import AddItemsForm from "../../../components/AddItemsForm";
import AddAccessoriesForm from "../../../components/AddItemForm";
import AddLinesForm from "../../../components/AddLinesForm";
import { RequisitionType } from "../types/requisition-type.enum";
import RequisitionLineCard from "./RequisitionLineCard";
import AddSupplyForm from "@/app/components/AddSupply";
import { DataGrid } from "@/app/components/datagrid/DataGrid";
import { DataGridRow } from "@/app/components/datagrid/DataGridRow";
import { DataGridCell } from "@/app/components/datagrid/DataGridCell";
import { RequisitionViewModel } from "../types/requisition-view.model";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { ItemType } from "../../items/types/item-type.enum";
import { useRequisitionLines } from "@/hooks/useRequisitionLines";
import { useRequisitions } from "@/hooks/useRequisitions";
import { UpdateRequisitionDto } from "../dto/update-requisition.dto";
import { RequisitionLineDto } from "../types/requisition-line.dto";
import { CreateRequisitionLineDto } from "../dto/create-requisition-line.dto";
import { ReturnStatus } from "../types/return-status.enum";

const REQUISITION_TYPE_OPTIONS = [
  /*{
    value: "INTERNAL_TRANSFER",
    label: "Transferencia interna",
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },*/
  {
    value: RequisitionType.ADJUSTMENT,
    label: "Ajuste",
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
  {
    value: RequisitionType.PURCHASE_RECEIPT,
    label: "Compra",
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },

  {
    value: RequisitionType.RENT,
    label: "Renta",
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.RETURN,
    label: "Devolución",
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.CONSUMPTION,
    label: "Consumo",
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.TRANSFER,
    label: "Tranferencia",
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.SALE,
    label: "Venta",
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
];

const REQUISITION_TYPE_LOCATIONS = [
  {
    value: "INTERNAL_TRANSFER",
    showSource: false,
    showDestination: true,
  },
  {
    value: "TRANSFER",
    showSource: false,
    showDestination: true,
  },
  {
    value: "ADJUSTMENT",
    showSource: false,
    showDestination: true,
  },
  {
    value: "PURCHASE_RECEIPT",
    showSource: false,
    showDestination: true,
  },
  {
    value: "RENT",
    showSource: false,
    showDestination: true,
  },
  {
    value: "SALE",
    showSource: false,
    showDestination: true,
  },
  {
    value: "CONSUMPTION",
    showSource: false,
    showDestination: true,
  },
  {
    value: "RETURN",
    showSource: false,
    showDestination: true,
  },
];

type Props = {
  requisitionId: number;
  onSuccess: () => void;
};

const columns = [
  { key: "item", title: "Ítem" },
  { key: "quantity", title: "Cantidad" },
  { key: "move", title: "Movimiento" },
  { key: "status", title: "Estado" },
  { key: "action", title: "Acción" },
];

export default function UpdateRequisitionForm({
  requisitionId,
  onSuccess,
}: Props) {
  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [step, setStep] = useState<number>(1);

  //User
  const { user } = useAuth();

  const role = user?.user_role;

  const requisitionTypeOptions = useMemo(() => {
    if (!role) return [];
    return REQUISITION_TYPE_OPTIONS.filter((opt) => opt.roles.includes(role));
  }, [role]);

  const [form, setForm] = useState<RequisitionViewModel>({
    id: "",
    requested_by: user?.person_id || "",
    approved_by: "",
    destination_location_id: "",
    type: RequisitionType.INTERNAL_TRANSFER,
    status: RequisitionStatus.DRAFT,
    notes: "",
    created_at: "",
    updated_at: "",
    approved_at: "",
    executed_at: "",
    received_at: "",
    //extra
    requestor_name: user?.name || "",
    approver_name: "",
    destination_location_name: undefined,
    schedulled_at: "",
    return_status: ReturnStatus.NULL,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>("general");

  //Modals
  const [showAddItems, setShowAddItems] = useState<boolean>(false);
  const [showOrigins, setShowOrigins] = useState<boolean>(false);
  const [showDestinations, setshowDestinations] = useState<boolean>(false);
  const [showAddTool, setShowAddTool] = useState<boolean>(false);
  const [showAddSupply, setShowAddSupply] = useState<boolean>(false);

  const [showAddLines, setShowAddLines] = useState<boolean>(false);

  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [filteredItemUnits, setFilteredItemUnits] = useState<any[]>([]);
  const [filteredLines, setFilteredLines] = useState<any[]>([]);

  //Locations
  const [locations, setLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);

  //Requisition Items
  const [requisitionItems, setRequisitionItems] = useState<any[]>([]);

  const [selectedItem, setSelectedItem] = useState<any>(undefined);

  const [lines, setLines] = useState<any[]>([]);

  const [supplies, setSupples] = useState<any[]>([]);

  const typeConfig = REQUISITION_TYPE_LOCATIONS.find(
    (t) => t.value === form?.type,
  );

  const {
    getById: getRequisition,
    update: updateRequisition,
    loading: requisitionLoading,
  } = useRequisitions();
  const { getByRequisitionId: getRequisitionLines } = useRequisitionLines();

  useEffect(() => {
    Promise.all([
      handleGetRequisition(),
      handleGetLocations(),
      handleGetLines(),
    ]);
  }, [requisitionId]);

  useEffect(() => {
    handleFilterAdded();
    handleFilterLines();
  }, [requisitionItems]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetRequisition = async () => {
    const { success, data } = await getRequisition(requisitionId);
    if (success) {
      setForm(data);
    }
  };

  const handleGetLines = async () => {
    await getRequisitionLines(requisitionId).then(setRequisitionItems);
  };

  const handleUpdateRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatedLines: CreateRequisitionLineDto[] = requisitionItems.map(
      (line: any) => {
        return {
          id: line?.id || null,
          item_id: line.item_id,
          item_unit_id: line.item_unit_id || null,
          quantity: line.quantity,
          accessories: line.accessories,
        };
      },
    );

    console.log("formated lines", formatedLines);

    const payload: UpdateRequisitionDto = {
      requested_by: form?.requested_by,
      destination_location_id: form?.destination_location_id,
      type: form?.type,
      status: form?.status,
      notes: form?.notes,
      schedulled_at: form?.schedulled_at,
      lines: formatedLines,
    };

    console.log("payload", payload);

    const { success } = await updateRequisition(requisitionId, payload);
    console.log('success: ', success);
    if (success) {
      toast.success("Requisición actualizada exitosamente.");
      onSuccess();
    }
  };

  const handleGetLocations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/locations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setLocations(response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetItemUnits = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/item-units/get-by-requisition-type`,
        {
          params: {
            destinationId: form?.destination_location_id,
            requisitionType: form?.type,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      const newItems = response.data.data;
      setItemUnits(newItems);
      setFilteredItemUnits(newItems);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const handleGetSupplies = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items`, {
        params: { type: ItemType.SUPPLY },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("supplies", response.data.data);
      setSupples(response.data.data);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        const message =
          error?.response?.data?.message ??
          "El servidor no está disponible en este momento. Intente más tarde.";
        toast.error(message);
      }
    }
  };
  const handleFilterAdded = () => {
    const newItems = itemUnits;

    const addedIds = new Set(requisitionItems.map((i: any) => i.item_unit_id));

    const filtered = newItems.filter((i: any) => !addedIds.has(i.item_unit_id));

    setFilteredItemUnits(filtered);
  };

  const handleFilterLocations = (requisitionType: RequisitionType) => {
    if (
      requisitionType === RequisitionType.ADJUSTMENT ||
      requisitionType === RequisitionType.PURCHASE_RECEIPT ||
      requisitionType === RequisitionType.RETURN ||
      requisitionType === RequisitionType.INTERNAL_TRANSFER
    ) {
      setFilteredLocations(locations.filter((l) => l.type === "WAREHOUSE"));
    } else if (
      requisitionType === RequisitionType.RENT ||
      requisitionType === RequisitionType.CONSUMPTION ||
      requisitionType === RequisitionType.TRANSFER
    ) {
      setFilteredLocations(locations.filter((l) => l.type === "PROJECT"));
    } else {
      setFilteredLocations(locations);
    }
  };

  const handleFilterLines = async () => {
    const newLines = lines;

    const addedIds = new Set(requisitionItems.map((l: any) => l.item_unit_id));

    const filtered = newLines.filter((l: any) => !addedIds.has(l.item_unit_id));

    setFilteredLines(filtered);
  };

  const selectDestination = (location: any) => {
    console.log("ubicación seleccionada", location);
    setForm((prev) => ({
      ...prev,
      destination_location_id: location.id,
      destination_location_name: location.name,
    }));

    console.log("form actualizado", form);

    setshowDestinations(false);
  };

  const handleAddItem = (item: any) => {
    console.log("agregando item", item);
    const newItem = {
      temp_id: item.temp_id,
      item_id: Number(item.item_id),
      item_name: item.name,
      item_brand: item.brand ?? "",
      item_model: item.model ?? "",
      item_unit_id: item.item_unit_id ?? "",
      internal_code: item.internal_code ?? "",
      quantity: item.quantity,
      unit_code: item.unit_code,
      unit_name: item.unit_name,
      image_path: item.image_path ?? null,
      return_of_id: item?.return_of_id ?? null,
      accessories: item?.accessories,
      source_location_id: item?.location_id,
      source_location_name: item?.location_name,
      destination_location_id: form?.destination_location_id,
      destination_location_name: form?.destination_location_name,
    };

    console.log("nuevo item", newItem);

    setRequisitionItems((prev) => {
      const exists = prev.some((a) => a.temp_id === item.temp_id);

      toast.success("Artículo agregado exitosamente");
      return exists
        ? prev.map((a) => (a.temp_id === item.temp_id ? newItem : a))
        : [...prev, newItem];
    });

    setShowAddTool(false);
    setShowAddSupply(false);
    setShowAddLines(false);
  };

  const removeItem = (item: any) => {
    console.log("removiendo item", item);
    setRequisitionItems((prev) =>
      prev.filter((a) => a.temp_id !== item.temp_id),
    );
  };

  const handleAdd = () => {
    setShowAddItems(true);
  };

  const handleClearLocations = () => {
    setForm((prev) => ({
      ...prev,
      source_location_id: "",
      destination_location_id: "",
      source: undefined,
      destination: undefined,
    }));
  };

  return (
    <>
      <form
        onSubmit={handleUpdateRequisition}
        className="space-y-6 text-gray-800"
      >
        {/* STEPPER */}
        <div className="w-full flex items-center mb-8">
          {[1, 2, 3].map((s, idx) => {
            const isActive = step === s;
            const isCompleted = step > s;

            return (
              <div key={s} className="flex-1 flex items-center">
                {/* Círculo + Label */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
              w-9 h-9 flex items-center justify-center
              rounded-full text-sm font-semibold
              transition
              ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }
            `}
                  >
                    {s}
                  </div>

                  <span
                    className={`
              mt-2 text-xs font-medium
              ${
                isCompleted
                  ? "text-green-600"
                  : isActive
                    ? "text-blue-600"
                    : "text-gray-400"
              }
            `}
                  >
                    {s === 1 && "General"}
                    {s === 2 && "Artículos"}
                    {s === 3 && "Resumen"}
                  </span>
                </div>

                {/* Línea */}
                {idx < 2 && (
                  <div
                    className={`
              flex-1 h-[2px] mx-2 transition
              ${step > s ? "bg-green-500" : "bg-gray-200"}
            `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <FormSection
            title="Información general"
            description="Datos básicos de la requisición"
          >
            <FormRadioGroup
              label="Tipo de requisición"
              name="type"
              value={RequisitionType[form?.type as RequisitionType]}
              options={requisitionTypeOptions}
              onChange={(e: any) => {
                handleChange(e);
                handleClearLocations();
                handleFilterLocations(e.target.value);
                selectDestination({
                  id: "",
                  name: "",
                });
              }}
            />

            {typeConfig?.showDestination && (
              <FormSelectSearch
                label="Destino"
                value={{
                  id: form?.destination_location_id,
                  name: form?.destination_location_name || "",
                }}
                options={filteredLocations}
                onSelect={selectDestination}
              />
            )}

            <FormDate
              label="Fecha programada"
              name="schedulled_at"
              value={form?.schedulled_at?.split("T")[0]}
              onChange={handleChange}
            />

            <FormText
              placeholder=""
              label="Notas"
              name="notes"
              value={form?.notes}
              onChange={handleChange}
            />

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => {
                  if (
                    !form?.type ||
                    !form?.destination_location_id ||
                    !form?.schedulled_at
                  ) {
                    return toast.error("Complete todos los campos requeridos");
                  }
                  handleGetItemUnits();
                  handleGetSupplies();
                  setStep(2);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
              >
                Siguiente
              </button>
            </div>
          </FormSection>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <FormSection
            title="Artículos"
            description="Seleccione los artículos a incluir. Puede agregar, quitar o ajustar cantidades antes de continuar."
          >
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => handleAdd()}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
              >
                + Agregar
              </button>
            </div>

            <DataGrid>
              <DataGridRow className="grid px-4 py-3 text-[11px] tracking-wide text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                {columns.map((col) => (
                  <DataGridCell key={col.key} className="font-bold">
                    {col.title}
                  </DataGridCell>
                ))}
              </DataGridRow>
              {requisitionItems?.map((line) => (
                <RequisitionLineCard
                  key={line.id}
                  requisition={form}
                  line={line}
                  onRemove={removeItem}
                />
              ))}
            </DataGrid>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setRequisitionItems([]);
                }}
                className="bg-gray-200 hover:bg-gray-100 px-6 py-2 rounded-lg"
              >
                Anterior
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!requisitionItems.length)
                    return toast.error("Agregue al menos un artículo");
                  setStep(3);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
              >
                Siguiente
              </button>
            </div>
          </FormSection>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <FormSection title="" description="">
              <RequisitionHeader requisition={form} />
            </FormSection>

            <FormSection title="" description="">
              <DataGrid>
                <DataGridRow className="grid px-4 py-3 text-[11px] tracking-wide text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  {columns.map((col) => (
                    <DataGridCell key={col.key} className="font-bold">
                      {col.title}
                    </DataGridCell>
                  ))}
                </DataGridRow>
                {requisitionItems?.map((line) => (
                  <RequisitionLineCard
                    key={line.id}
                    requisition={form}
                    line={line}
                    onRemove={removeItem}
                  />
                ))}
              </DataGrid>
            </FormSection>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-100 px-6 py-2 rounded-lg"
              >
                Anterior
              </button>

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                Crear Requisición
              </button>
            </div>
          </>
        )}
      </form>

      {/*ADD ITEMS FORM*/}
      {showAddItems && (
        <Modal
          title="Agregar Artículos"
          open={showAddItems}
          onClose={() => setShowAddItems(false)}
        >
          <AddItemsForm
            requisitionType={form?.type}
            itemUnits={filteredItemUnits}
            supplies={supplies}
            onAdd={(item: any) => {
              setShowAddTool(true);
              setSelectedItem(item);
            }}
            onAddSupply={(item: any) => {
              setShowAddSupply(true);
              setSelectedItem(item);
            }}
          />
        </Modal>
      )}

      {/*ADD TOOL FORM*/}
      <Modal
        title="Agregar Articulo"
        open={showAddTool}
        onClose={() => setShowAddTool(false)}
      >
        <AddAccessoriesForm
          itemUnit={selectedItem}
          addedAccessories={[]}
          onAdd={handleAddItem}
        />
      </Modal>

      {/*ADD SUPPLY FORM*/}
      <Modal
        title="Agregar Articulo"
        open={showAddSupply}
        onClose={() => setShowAddSupply(false)}
      >
        <AddSupplyForm
          itemId={selectedItem?.id}
          requisitionType={RequisitionType[form?.type as RequisitionType]}
          onAdd={handleAddItem}
          onClose={() => setShowAddSupply(false)}
        />
      </Modal>

      {/*ADD LINE FORM*/}
      <Modal
        title="Agregar Articulos"
        open={showAddLines}
        onClose={() => setShowAddLines(false)}
      >
        <AddLinesForm lines={filteredLines} onAdd={handleAddItem} />
      </Modal>
    </>
  );
}
