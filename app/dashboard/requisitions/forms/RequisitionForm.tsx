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
import RequisitionHeader from "../components/RequisitionHeader";
import FormDate from "../../../components/form/FormDate";
import AddItemsForm from "../components/AddItemsForm";
import AddAccessoriesForm from "../components/AddItemForm";
import AddLinesForm from "../../../components/AddLinesForm";
import { RequisitionType } from "../types/requisition-type.enum";
import AddSupplyForm from "@/app/dashboard/requisitions/components/AddSupply";
import { DataGrid } from "@/app/components/datagrid/DataGrid";
import { RequisitionViewModel } from "../dto/requisition-view-model.dto";
import { RequisitionStatus } from "../types/requisition-status.enum";
import { useRequisitions } from "@/hooks/useRequisitions";
import { ReturnStatus } from "../types/return-status.enum";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { MdCheck, MdClose, MdOutlineInventory2 } from "react-icons/md";
import { REQUISITION_TYPE_CONFIG } from "@/constants/RequisitionType";
import { ROLE_REASON_OPTIONS } from "../types/role-reason-options";
import { CreateRequisitionDto } from "../dto/create-requisition.dto";
import {
  filterLocationsByRule,
  requiresDestination,
} from "../helpers/requisition-location.helper";
import { MovementType } from "../types/movement-type";
import { getItemKey } from "@/app/utils/requisition-utils";
import { toDateInputValue } from "@/app/utils/formatters";
import { useRequisitionLines } from "@/hooks/useRequisitionLines";
import { AddedLineViewModel } from "../dto/added-line-view-model.dto";
import { is } from "date-fns/locale";
import { on } from "events";
import { LocationViewModel } from "../../locations/types/location-view-model";
import { useConfirm } from "@/hooks/userConfirm";
import { MOVEMENT_REASON_OPTIONS } from "../types/movement-reason-options copy";

type Props = {
  requisition?: RequisitionViewModel;
  movement?: MovementType;
  userLocations?: LocationViewModel[];
  type?: RequisitionType;
  onSuccess: () => void;
};

export default function NewRequisitionForm({
  requisition,
  movement,
  type,
  onSuccess,
  userLocations,
}: Props) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [step, setStep] = useState<number>(1);
  const { user } = useAuth();
  const role = user?.user_role;
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
  const [locations, setLocations] = useState<LocationViewModel[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<
    LocationViewModel[]
  >([]);
  const [requisitionItems, setRequisitionItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(undefined);
  const [lines, setLines] = useState<any[]>([]);
  const [supplies, setSupples] = useState<any[]>([]);
  const [requireDestination, setRequireDestination] = useState<boolean>(false);
  const [item, setItem] = useState<any>(undefined);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [form, setForm] = useState<RequisitionViewModel>({
    id: "",
    code: "",
    requested_by: user?.person_id || "",
    approved_by: "",
    destination_location_id: null,
    movement: movement || MovementType.IN,
    type: type || RequisitionType.INTERNAL_TRANSFER,
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
  const { confirm: openConfirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    if (requisition) {
      setLoading(true);
      setIsEdit(true);
      const fetchData = async () => {
        await handleGetRequisition(Number(requisition.id));
        await handleGetLines(Number(requisition.id));
      };
      fetchData();
      setLoading(false);
    }
  }, [requisition]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (type && movement && locations.length) {
      handleFilterLocations(type, movement);
    }
  }, [type, movement, locations]);

  const { getById: getRequisition } = useRequisitions();
  const { getByRequisitionId: getRequisitionLines } = useRequisitionLines();

  const handleGetRequisition = async (id: number) => {
    const { success, data } = await getRequisition(id);
    if (success) {
      const dataWithFormattedDate = {
        ...data,
        schedulled_at: toDateInputValue(data.schedulled_at),
      };
      setForm(dataWithFormattedDate);
    }
  };

  const handleGetLines = async (id: number) => {
    const data = await getRequisitionLines(id);
    const items: AddedLineViewModel[] = data.map(
      (line: any): AddedLineViewModel => ({
        id: line.id,
        item_key: getItemKey(line),
        item_id: line.item_id,
        item_unit_id: line.item_unit_id,
        name: line.name,
        brand: line.brand,
        model: line.model,
        internal_code: line.internal_code,
        available_quantity: line.available_quantity,
        image_path: line.image_path,
        //extras
        quantity: line.quantity,
        unit_code: line.unit_code,
        unit_name: line.unit_name,
        return_of_id: line.return_of_line_id,
        accessories: line.accessories,
        source_location_id: line.source_location_id,
        source_location_name: line.source_location_name,
        destination_location_id: line.destination_location_id,
        destination_location_name: line.destination_location_name,
      }),
    );

    setRequisitionItems(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);



    const lines = requisitionItems.map((i: any) => ({
      item_id: i.item_id,
      item_unit_id: i.item_unit_id || null,
      quantity: i.quantity,
      accessories: i.accessories || null,
      return_of_line_id: i.return_of_id || null,
      source_location_id: i.source_location_id,
    }));

    const payload: CreateRequisitionDto = {
      requested_by: form?.requested_by || "",
      destination_location_id: Number(form?.destination_location_id) || null,
      type: form?.type,
      movement: form?.movement,
      status: form?.status,
      notes: form?.notes || "",
      lines: lines,
      schedulled_at: form?.schedulled_at,
    };

    const { success } = await createRequisition(payload);

    if (success) {
      onSuccess();
      toast.success("Requisición creada exitosamente");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const lines = requisitionItems.map((i: any) => ({
        id: i.id,
        item_id: i.item_id,
        item_unit_id: i.item_unit_id || null,
        quantity: i.quantity,
        accessories: i.accessories || null,
        return_of_line_id: i.return_of_id || null,
        source_location_id:
          i.internal_code === null ? i.source_location_id : null,
      }));

      const payload: CreateRequisitionDto = {
        requested_by: form?.requested_by || "",
        destination_location_id: Number(form?.destination_location_id) || null,
        type: form?.type,
        movement: form?.movement,
        status: form?.status,
        notes: form?.notes || "",
        lines: lines,
        schedulled_at: form?.schedulled_at,
      };

      const response = await axios.put(
        `${apiUrl}/requisitions/${form.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      toast.success("Requisición actualizada exitosamente");
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    } finally {
      setLoading(false);
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
  const handleGetCatalog = async (movement: string, type: string) => {
    try {
      const response = await axios.get(`${apiUrl}/items/get-catalog`, {
        params: { movement, type },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setItemUnits(response.data.itemUnits);
      setFilteredItemUnits(response.data.itemUnits);
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
    const filtered = filterLocationsByRule(
      locations,
      requisitionType,
      currentMovement as MovementType,
    );
    setFilteredLocations(filtered);
    console.log("ubicaciones filtradas", filtered);
    setRequireDestination(
      requiresDestination(requisitionType, currentMovement as MovementType),
    );
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
    console.log("item seleccionado", item);
    const itemKey = getItemKey(item); // 👈

    const newItem = {
      id: item?.id,
      item_key: itemKey,
      item_id: Number(item.item_id),
      item_unit_id: item.item_unit_id ?? "",
      name: item.name,
      brand: item.brand ?? "",
      model: item.model ?? "",
      internal_code: item.internal_code ?? null,
      available_quantity: item.available_quantity,
      image_path: item.image_path ?? null,
      //extras
      quantity: item.quantity,
      unit_code: item.unit_code,
      unit_name: item.unit_name,
      return_of_id: item?.return_of_id ?? null,
      accessories: item?.accessories,
      source_location_id: item?.location_id,
      source_location_name: item?.location_name,
      destination_location_id: form?.destination_location_id,
      destination_location_name: form?.destination_location_name,
    };

    setRequisitionItems((prev) => {
      const exists = prev.some((a) => a.item_key === itemKey); // 👈

      toast.success("Artículo agregado exitosamente");
      return exists
        ? prev.map((a) => (a.item_key === itemKey ? newItem : a))
        : [...prev, newItem];
    });

    setSelectedItem(undefined);
    setItem(undefined);
    setShowAddTool(false);
    setShowAddSupply(false);
    setShowAddLines(false);
  };

  const removeItem = (item: any) => {
    setRequisitionItems((prev) =>
      prev.filter((a) => a.item_key !== item.item_key),
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
    if (type === RequisitionType.RENT || type === RequisitionType.CONSUMPTION) {
      setLocations(userLocations || []);
    } else {
      handleGetLocations();
    }
  }, []);

  useEffect(() => {
    handleFilterAdded();
    handleFilterLines();
  }, [requisitionItems]);

  return (
    <>
      <div className="space-y-2">
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
          <FormSection title="" description="">
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
                {}
               
                <FormRadioGroup
                  label="Movimiento"
                  name="movement"
                  value={form?.movement}
                  options={[
                    { label: "Entrada", value: "IN" },
                    { label: "Salida", value: "OUT" },
                    { label: "Interno", value: "INT" },
                    { label: "Externo", value: "EXT" },
                  ]}
                  onChange={(e: any) => {
                    handleChange(e);
                    handleClearLocations();
                    handleFilterLocations(form?.type, e.target.value); // pasa el valor nuevo
                    setForm((prev) => ({ ...prev, type: "" as any }));
                    setRequisitionItems([]);
                  }}
                />

                {form?.movement && (
                  <FormRadioGroup
                    label="Razón"
                    name="type"
                    value={form?.type}
                    options={
                      MOVEMENT_REASON_OPTIONS[form.movement as MovementType]?.map((opt) => ({
                        label:
                          MOVEMENT_REASON_OPTIONS[form.movement as MovementType]?.find(
                            (o) => o.reason === opt.reason,
                          )?.label ?? opt.label,
                        value: opt.reason,
                      })) || []
                    }
                    onChange={(e: any) => {
                      handleChange(e);
                      handleClearLocations();
                      handleFilterLocations(e.target.value, form?.movement); // pasa el valor nuevo
                      selectDestination({ id: null, name: "" });
                      setRequisitionItems([]);
                    }}
                  />
                )}
              </>
            )}

            {requireDestination && (
              <FormSelectSearch
                label="Destino"
                value={{
                  id: String(form?.destination_location_id),
                  name: form?.destination_location_name || "",
                }}
                options={filteredLocations}
                onSelect={selectDestination}
              />
            )}

            <FormDate
              label="Fecha programada"
              name="schedulled_at"
              value={form?.schedulled_at}
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
                  if (!form?.type || !form?.schedulled_at) {
                    return toast.error("Complete todos los campos requeridos");
                  }
                  if (requireDestination && !form?.destination_location_id) {
                    return toast.error("Seleccione un destino");
                  }
                  handleGetCatalog(form?.movement, form?.type);
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
              onRowClick={(i: any) => {
                if (!i.internal_code) {
                  const supplyItem = supplies.find(
                    (s) =>
                      s.id == i.item_id &&
                      s.location_id == i.source_location_id,
                  );

                  setSelectedItem(i);
                  setItem(supplyItem);
                  setShowAddSupply(true);
                }
              }}
            >
              <PagedDataGrid.Column field="item" title="Artículo">
                {(row) => (
                  <div className="flex flex-col justify-center">
                    {row.internal_code && (
                      <span className="text-xs text-gray-500">
                        {row.internal_code}
                      </span>
                    )}
                    <span className="text-gray-800 font-semibold">
                      {row.name}
                    </span>
                    {row.brand && row.model && (
                      <span className="text-xs text-gray-500">
                        {row.brand} · {row.model}
                      </span>
                    )}
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
              <PagedDataGrid.Action
                icon={<MdClose />}
                label=""
                onClick={(row) => removeItem(row)}
              />
            </PagedDataGrid>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
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
                  {(row: AddedLineViewModel) => (
                    <div className="flex flex-col">
                      {row.internal_code && (
                        <span className="text-xs text-gray-500">
                          {row.internal_code}
                        </span>
                      )}
                      <span className="text-gray-800 font-semibold">
                        {row.name}
                      </span>

                      {row.brand && row.model && (
                        <span className="text-xs text-gray-500">
                          {row.brand} · {row.model}
                        </span>
                      )}
                    </div>
                  )}
                </PagedDataGrid.Column>

                <PagedDataGrid.Column field="quantity" title="Cantidad">
                  {(row: AddedLineViewModel) => (
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
                type="button"
                onClick={(e) => {
                  openConfirm({
                    title: isEdit
                      ? "Actualizar Requisición"
                      : "Crear Requisición",
                    description: "¿Está seguro que desea continuar?",
                    variant: "info",
                    onConfirm: () => handleSubmit(e),
                  });
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                {isEdit ? "Actualizar Requisición" : "Crear Requisición"}
              </button>
            </div>
          </>
        )}
      </div>

      {/*ADD ITEMS FORM*/}
      {showAddItems && (
        <Modal
          title="Agregar Artículos"
          open={showAddItems}
          onClose={() => setShowAddItems(false)}
        >
          <AddItemsForm
            itemUnits={filteredItemUnits}
            addedItems={requisitionItems}
            supplies={supplies}
            onAdd={(item: any) => {
              setShowAddTool(true);
              setSelectedItem(item);
            }}
            onAddSupply={(i: any) => {
              const supplyItem = supplies.find(
                (s) => s.id == i.id && s.location_id == i.location_id,
              );
              //setSelectedItem(i);
              setItem(supplyItem);
              setShowAddSupply(true);
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
        onClose={() => {
          setSelectedItem(undefined);
          setItem(undefined);
          setShowAddSupply(false);
        }}
      >
        <AddSupplyForm
          selectedItem={selectedItem}
          item={item}
          requisitionType={RequisitionType[form?.type as RequisitionType]}
          onAdd={handleAddItem}
          onClose={() => {
            setSelectedItem(undefined);
            setItem(undefined);
            setShowAddSupply(false);
          }}
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

      <ConfirmDialog />
    </>
  );
}
