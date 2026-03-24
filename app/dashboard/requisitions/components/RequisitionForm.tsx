"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Modal from "../../../components/Modal";
import { useAuth } from "@/context/AuthContext";
import FormSection from "../../../components/form/FormSection";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import FormText from "../../../components/form/FormText";
import RequisitionHeader from "./RequisitionHeader";
import FormDate from "../../../components/form/FormDate";
import AddItemsForm from "../../items/components/AddItemsForm";
import AddAccessoriesForm from "../../items/components/AddItemForm";
import AddLinesForm from "../../../components/AddLinesForm";
import { RequisitionType } from "../types/requisition-type.enum";
import RequisitionLineCard from "./RequisitionLineCard";
import AddSupplyForm from "@/app/dashboard/items/components/AddSupply";
import { DataGrid } from "@/app/components/datagrid/DataGrid";
import { DataGridRow } from "@/app/components/datagrid/DataGridRow";
import { DataGridCell } from "@/app/components/datagrid/DataGridCell";
import { RequisitionViewModel } from "../types/requisition-view.model";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { ItemType } from "../../items/types/item-type.enum";
import { useRequisitions } from "@/hooks/useRequisitions";
import { ReturnStatus } from "../types/return-status.enum";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import BooleanBadge from "@/app/components/badges/BooleanBadge";
import {
  MdCheck,
  MdClose,
  MdDelete,
  MdOutlineInventory2,
} from "react-icons/md";
import ActionButton from "@/app/components/ActionButton";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { LocationType } from "../../locations/types/location-type.enum";
import { ROLE_REASON_OPTIONS } from "../types/role-reason-options";
import { CreateRequisitionDto } from "../dto/create-requisition.dto";
import {
  filterLocationsByRule,
  requiresDestination,
} from "../helpers/requisition-location.helper";
import { MovementType } from "../types/movement-type";

const REQUISITION_TYPE_OPTIONS = [
  {
    value: "INTERNAL_TRANSFER",
    label: "Transferencia interna",
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
  {
    value: RequisitionType.ADJUSTMENT,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.ADJUSTMENT].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
  {
    value: RequisitionType.PURCHASE_RECEIPT,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.PURCHASE_RECEIPT].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },

  {
    value: RequisitionType.RENT,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.RENT].label,
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.RETURN,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.RETURN].label,
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.CONSUMPTION,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.CONSUMPTION].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.TRANSFER,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.TRANSFER].label,
    roles: ["ADMIN", "CLIENT", "CONTRACTOR"],
  },
  {
    value: RequisitionType.SALE,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.SALE].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },

  {
    value: RequisitionType.MAINTENANCE,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.MAINTENANCE].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
  {
    value: RequisitionType.OUT_OF_SERVICE,
    label: REQUISITION_TYPE_CONFIG[RequisitionType.OUT_OF_SERVICE].label,
    roles: ["ADMIN", "WAREHOUSE_MANAGER"],
  },
];

const REQUISITION_TYPE_LOCATIONS = [
  {
    value: RequisitionType.INTERNAL_TRANSFER,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.TRANSFER,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.ADJUSTMENT,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.PURCHASE_RECEIPT,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.RENT,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.SALE,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.CONSUMPTION,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.RETURN,
    showSource: false,
    showDestination: true,
  },
  {
    value: RequisitionType.MAINTENANCE,
    showSource: false,
    showDestination: true,
  },
];

type Props = {
  type?: RequisitionType;
  onSuccess: () => void;
};

export default function NewRequisitionForm({ type, onSuccess }: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [step, setStep] = useState<number>(1);
  const { user } = useAuth();
  const role = user?.user_role;
  const [movement, setMovement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddItems, setShowAddItems] = useState<boolean>(false);
  const [showDestinations, setshowDestinations] = useState<boolean>(false);
  const [showAddTool, setShowAddTool] = useState<boolean>(false);
  const [showAddSupply, setShowAddSupply] = useState<boolean>(false);
  const [showAddLines, setShowAddLines] = useState<boolean>(false);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [filteredItemUnits, setFilteredItemUnits] = useState<any[]>([]);
  const [filteredLines, setFilteredLines] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
  const [requisitionItems, setRequisitionItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(undefined);
  const [lines, setLines] = useState<any[]>([]);
  const [supplies, setSupples] = useState<any[]>([]);
  const [requireDestination, setRequireDestination] = useState<boolean>(false);

  const requisitionTypeOptions = useMemo(() => {
    if (!role) return [];
    return REQUISITION_TYPE_OPTIONS.filter((opt) => opt.roles.includes(role));
  }, [role]);

  const [form, setForm] = useState<RequisitionViewModel>({
    id: "",
    requested_by: user?.person_id || "",
    approved_by: "",
    destination_location_id: null,
    movement: MovementType.IN,
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
    destination_location_name: "",
    destination_address: "",
    schedulled_at: "",
    return_status: ReturnStatus.NONE,
  });

  const { create: createRequisition } = useRequisitions();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("lines", requisitionItems);

    const lines = requisitionItems.map((i: any) => ({
      item_id: i.item_id,
      item_unit_id: i.item_unit_id || null,
      quantity: i.quantity,
      accessories: i.accessories || null,
      return_of_line_id: i.return_of_id || null,
      source_location_id: i.internal_code === "" ? i.source_location_id : null,
    }));

    const payload: CreateRequisitionDto = {
      requested_by: form.requested_by || "",
      destination_location_id: Number(form.destination_location_id) || null,
      type: form.type,
      movement: form.movement,
      status: form.status,
      notes: form.notes || "",
      lines: lines,
      schedulled_at: form.schedulled_at,
    };

    const { success } = await createRequisition(payload);

    if (success) {
      onSuccess();
      toast.success("Requisición creada exitosamente");
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

  /*const handleGetItemUnits = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/items/get-all-with-properties`,
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
      console.log("Fetched item units:", newItems);
      setItemUnits(newItems);
      setFilteredItemUnits(newItems);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };*/

  /*const handleGetSupplies = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/items/get-available-supplies`,
        {
          params: { type: ItemType.SUPPLY },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log("Fetched supplies:", response.data.data);
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
  };*/

  const handleGetCatalog = async () => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-catalog`, {
        params: { movement: form.movement, type: form.type },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Fetched catalog:", response.data);
      setItemUnits(response.data.itemUnits);
      setSupples(response.data.supplies);
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

  const handleFilterLocations = (
    requisitionType: RequisitionType,
    currentMovement: string, // recibe el valor nuevo
  ) => {
    console.log(
      "Filtering locations for type",
      requisitionType,
      "and movement",
      currentMovement,
    );
    const filtered = filterLocationsByRule(
      locations,
      requisitionType,
      currentMovement as MovementType,
    );
    console.log("filtered locations", filtered);
    setFilteredLocations(filtered);
    setRequireDestination(filtered.length > 0);
  };

  const handleFilterLines = async () => {
    const newLines = lines;
    const addedIds = new Set(requisitionItems.map((l: any) => l.item_unit_id));
    const filtered = newLines.filter((l: any) => !addedIds.has(l.item_unit_id));
    setFilteredLines(filtered);
  };

  const selectDestination = (location: any) => {
    setForm((prev) => ({
      ...prev,
      destination_location_id: location.id,
      destination_location_name: location.name,
    }));
    setshowDestinations(false);
  };

  const handleAddItem = (item: any) => {
    console.log("Adding item to requisition:", item);

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
      source_location_id: null,
      destination_location_id: null,
      source: undefined,
      destination: undefined,
    }));
  };

  useEffect(() => {
    handleGetLocations();
  }, []);

  useEffect(() => {
    handleFilterAdded();
    handleFilterLines();
  }, [requisitionItems]);

  return (
    <>
      <form onSubmit={handleCreate} className="space-y-2">
        {/* STEPPER */}
        <div className="relative w-full flex items-start mb-8">
          {[1, 2, 3].map((s, idx) => {
            const isActive = step === s;
            const isCompleted = step > s;

            return (
              <React.Fragment key={s}>
                {/* Columna del paso */}
                <div className="relative z-10 flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition
              ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }
            `}
                  >
                    {isCompleted ? <MdCheck size={16} /> : s}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium
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

                {/* Línea entre pasos */}
                {idx < 2 && (
                  <div
                    className="flex-1 flex items-center"
                    style={{ marginTop: "18px" }}
                  >
                    <div className="relative w-full h-[2px] bg-gray-200">
                      <div
                        className={`absolute inset-y-0 left-0 transition-all duration-500
                  ${step > s ? "bg-green-500 w-full" : "w-0"}
                `}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <FormSection
            title="Información general"
            description="Datos básicos de la requisición"
          >
            {type ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {/* ícono según el tipo */}
                  {React.createElement(
                    REQUISITION_TYPE_CONFIG[type]?.icon ?? MdOutlineInventory2,
                    {
                      size: 16,
                      className: "text-blue-500",
                    },
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700">
                    {REQUISITION_TYPE_CONFIG[type]?.label}
                  </div>
                  <div className="text-xs text-blue-500">
                    {REQUISITION_TYPE_CONFIG[type]?.description}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <FormRadioGroup
                  label="Movimiento"
                  name="movement"
                  value={form?.movement}
                  options={[
                    { label: "Entrada", value: "IN" },
                    { label: "Salida", value: "OUT" },
                    { label: "Interno", value: "INT" },
                  ]}
                  onChange={(e: any) => {
                    handleChange(e);
                    handleClearLocations();
                    handleFilterLocations(form.type, e.target.value); // pasa el valor nuevo
                    setForm((prev) => ({ ...prev, type: "" as any }));
                  }}
                />

                {form.movement && (
                  <FormRadioGroup
                    label="Razón"
                    name="type"
                    value={form.type}
                    options={
                      ROLE_REASON_OPTIONS[role ? role : ""]
                        ?.filter((o: any) => o.movement === form.movement)
                        .map((o: any) => ({
                          label: o.label,
                          value: o.reason,
                        })) ?? []
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      handleClearLocations();
                      handleFilterLocations(e.target.value, form.movement); // pasa el valor nuevo
                      selectDestination({ id: null, name: "" });
                    }}
                  />
                )}
              </>
            )}

            {requireDestination && (
              <FormSelectSearch
                label="Destino"
                value={{
                  id: String(form.destination_location_id),
                  name: form.destination_location_name || "",
                }}
                options={filteredLocations}
                onSelect={selectDestination}
              />
            )}

            <FormDate
              label="Fecha programada"
              name="schedulled_at"
              value={form.schedulled_at}
              onChange={handleChange}
            />

            <FormText
              placeholder=""
              label="Notas"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => {
                  if (!form.type || !form.schedulled_at) {
                    return toast.error("Complete todos los campos requeridos");
                  }
                  if (requireDestination && !form.destination_location_id) {
                    return toast.error("Seleccione un destino");
                  }
                  //handleGetItemUnits();
                  //handleGetSupplies();
                  handleGetCatalog();
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

            <PagedDataGrid
              data={requisitionItems}
              total={requisitionItems.length}
              page={1}
              pageSize={DataGrid.length}
              onLoadData={() => {}}
              pagination={false}
            >
              <PagedDataGrid.Column field="item" title="Artículo">
                {(row) => (
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {row.internal_code}
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {row.item_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {row.item_brand} · {row.item_model}
                    </span>
                  </div>
                )}
              </PagedDataGrid.Column>

              <PagedDataGrid.Column field="quantity" title="Cantidad">
                {(row) => (
                  <span className="text-xs text-gray-500">
                    {row.quantity} {row.unit_code}
                  </span>
                )}
              </PagedDataGrid.Column>
              <PagedDataGrid.Column field="location" title="Ubicación">
                {(row) => (
                  <span className="flex items-center justify-start text-xs text-gray-500">
                    {row.source_location_name
                      ? row.source_location_name
                      : "Sin ubicación"}{" "}
                  </span>
                )}
              </PagedDataGrid.Column>
              <PagedDataGrid.Column field="accessories" title="Accesorios">
                {(row) => (
                  <span className="flex items-center justify-start text-xs text-gray-500">
                    {row.accessories && row.accessories.length > 0
                      ? row.accessories
                          .map((a: any) => `${a.quantity}x ${a.name}`)
                          .join(", ")
                      : "N/A"}{" "}
                  </span>
                )}
              </PagedDataGrid.Column>
              <PagedDataGrid.Column field="actions" title="Acciones">
                {(row) => (
                  <ActionButton
                    icon={<MdClose />}
                    label=""
                    onClick={() => removeItem(row)}
                    color="bg-red-50 hover:bg-red-100 text-red-400"
                  />
                )}
              </PagedDataGrid.Column>
            </PagedDataGrid>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setRequisitionItems([]);
                }}
                className="bg-gray-200 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg"
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

              <PagedDataGrid
                data={requisitionItems}
                total={requisitionItems.length}
                page={1}
                pageSize={DataGrid.length}
                onLoadData={() => {}}
                pagination={false}
              >
                <PagedDataGrid.Column field="item" title="Artículo">
                  {(row) => (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {row.internal_code}
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {row.item_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {row.item_brand} · {row.item_model}
                      </span>
                    </div>
                  )}
                </PagedDataGrid.Column>

                <PagedDataGrid.Column field="quantity" title="Cantidad">
                  {(row) => (
                    <span className="text-xs text-gray-500">
                      {row.quantity} {row.unit_code}
                    </span>
                  )}
                </PagedDataGrid.Column>
                <PagedDataGrid.Column field="location" title="Ubicación">
                  {(row) => (
                    <span className="flex items-center justify-start text-xs text-gray-500">
                      {row.source_location_name
                        ? row.source_location_name
                        : "Sin ubicación"}{" "}
                    </span>
                  )}
                </PagedDataGrid.Column>
                <PagedDataGrid.Column field="accessories" title="Accesorios">
                  {(row) => (
                    <span className="flex items-center justify-start text-xs text-gray-500">
                      {row.accessories && row.accessories.length > 0
                        ? row.accessories
                            .map((a: any) => `${a.quantity}x ${a.name}`)
                            .join(", ")
                        : "N/A"}{" "}
                    </span>
                  )}
                </PagedDataGrid.Column>
                <PagedDataGrid.Column field="actions" title="Acciones">
                  {(row) => (
                    <ActionButton
                      icon={<MdClose />}
                      label=""
                      onClick={() => removeItem(row)}
                      color="bg-red-50 hover:bg-red-100 text-red-400"
                    />
                  )}
                </PagedDataGrid.Column>
              </PagedDataGrid>
            </FormSection>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg"
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
            itemUnits={filteredItemUnits}
            requisitionType={form?.type}
            supplies={supplies}
            onAdd={(item: any) => {
              setShowAddTool(true);
              setSelectedItem(item);
            }}
            onAddSupply={(item: any) => {
              setShowAddSupply(true);
              setSelectedItem(item);
            }}
            destinationLocationId={form?.destination_location_id}
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
          item={selectedItem}
          requisitionType={RequisitionType[form.type as RequisitionType]}
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
