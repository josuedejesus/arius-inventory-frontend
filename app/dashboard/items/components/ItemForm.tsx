"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Autocomplete from "../../../components/Autocomplete";
import FormSection from "../../../components/form/FormSection";
import FormField from "../../../components/form/FormField";
import FormRadioGroup from "../../../components/form/FormRadioGroup";
import FormSwitch from "../../../components/form/FormSwitch";
import FormSelectSearch from "../../../components/form/FormSelectSearch";
import FormImageUpload from "../../../components/form/FormImageUpload";
import { FormLayout } from "../../../components/form/FormLayout";
import FormTabs from "../../../components/form/FormTabs";
import LoadingScreen from "@/app/components/LoadingScreen";
import FormTabPanel from "@/app/components/form/FormTabPanel";
import ItemUnitCard from "@/app/dashboard/items/cards/ItemUnitCard";
import { ItemViewModel } from "../types/item-view.model";
import { ItemType } from "../types/item-type.enum";
import SearchBar from "@/app/components/SearchBar";
import Modal from "@/app/components/Modal";
import ItemUnitForm from "./ItemUnitForm";
import { UpdateItemDto } from "../types/update-item.dto";
import SavingScreen from "@/app/components/SavingScreen";
import PagedDataGrid from "@/app/components/paged-datagrid/PagedDatagrid";
import { ItemUnitViewModel } from "../types/item-unit-view.model";
import ItemCard from "../cards/ItemCard";

type ItemFormProps = {
  itemId?: () => void;
  onSuccess: () => void;
};

export default function ItemForm({ itemId, onSuccess }: ItemFormProps) {
  const [form, setForm] = useState<ItemViewModel>({
    name: "",
    brand: "",
    model: "",
    type: ItemType.TOOL,
    tracking: "",
    unit_id: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    image_path: "",
    minimum_stock: 0.0,
    usage_hours: 0,
    //extras
    unit_name: "",
    unit_code: "",
  });

  const [unit, setUnit] = useState<any>(undefined);

  //API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [searchValue, setSearchValue] = useState<string>("");
  const [units, setUnits] = useState<any[]>([]);
  const [itemUnits, setItemUnits] = useState<any[]>([]);
  const [accessories, setAcccessories] = useState<any[]>([]);
  const [itemAccessories, setItemAccessories] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedItemUnit, setSelectedItemUnit] = useState<any>(undefined);
  const [showItemUnitForm, setShowItemUnitForm] = useState<boolean>(false);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);

  const filteredUnits = itemUnits.filter((u: any) =>
    `${u.internal_code}`.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (itemId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setIsEdit(true);

          await Promise.all([
            handleGetItem(),
            handleGetItemAccessories(),
            handleGetItemUnits(),
          ]);
        } catch (error) {
          setError("Error obteniendo datos del artículo");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
    }
    handleGetUnits();
    handleGetAccessories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (isEdit) {
      handleUpdateItem();
    } else {
      handleCreateItem();
    }
  };

  const handleAcceptItemUnit = (unit: any) => {
    const { image_file, ...unitData } = unit;

    setItemUnits((prev) => {
      const existsIndex = prev.findIndex((u) => u.tempId === unit.tempId);

      if (existsIndex >= 0) {
        toast.success("Artículo actualizado exitosamente");

        return prev.map((u, i) =>
          i === existsIndex
            ? { ...unitData, image_file: image_file ?? u.image_file }
            : u,
        );
      }

      toast.success("Artículo creado exitosamente");

      return [...prev, { ...unitData, image_file }];
    });
  };

  const handleCreateItem = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("model", form.model);
      formData.append("type", form.type);
      formData.append("tracking", form.type ? "SERIAL" : "NONE");
      formData.append("unit_id", String(form.unit_id) || "");
      formData.append("is_active", String(form.is_active));
      formData.append("minimum_stock", String(form.minimum_stock));
      formData.append("usage_hours", String(form.usage_hours));
      formData.append("accessories", JSON.stringify(itemAccessories));
      formData.append("item_units", JSON.stringify(itemUnits));

      itemUnits.forEach((unit) => {
        if (unit.image_file) {
          formData.append("images", unit.image_file);
        }
      });

      const respose = await axios.post(`${apiUrl}/items`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(respose.data.message);
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const payload: UpdateItemDto = {
        name: form.name,
        brand: form.brand,
        model: form.model,
        type: form.type,
        tracking: form.type === ItemType.TOOL ? "SERIAL" : "NONE",
        unit_id: unit.id,
        is_active: form.is_active,
        minimum_stock: Number(form.minimum_stock),
        usage_hours: Number(form.usage_hours),
        accessories: itemAccessories,
        item_units: itemUnits,
      };

      const response = await axios.put(`${apiUrl}/items/${itemId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success(response.data.message);
      onSuccess();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };
  const handleGetItem = () => {
    axios
      .get(`${apiUrl}/items/${itemId}`)
      .then((response) => {
        const item = response.data.data;
        setForm(item);
        setUnit({
          id: item?.unit_id,
          name: item?.unit_name,
        });
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
        }
      });
  };

  const handleGetAccessories = () => {
    axios
      .get(`${apiUrl}/accessories`)
      .then((response) => {
        setAcccessories(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
        }
      });
  };

  const handleGetItemAccessories = () => {
    axios
      .get(`${apiUrl}/item-accessories/${itemId}/find-by-item`)
      .then((response) => {
        const accessories = response.data.data;

        const mappedAccessories: any[] = accessories.map((a: any) => ({
          id: a.accessory_id,
          name: a.name,
        }));

        setItemAccessories(mappedAccessories);
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
        }
      });
  };

  const handleGetUnits = () => {
    axios
      .get(`${apiUrl}/units`)
      .then((response) => {
        setUnits(response.data.data);
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ??
          "El servidor no está disponible en este momento. Intente más tarde.";
        toast.error(message);
      })
      .finally(() => {});
  };

  const handleGetItemUnits = async () => {
    try {
      const response = await axios.get(`${apiUrl}/item-units/item/${itemId}`);
      setItemUnits(response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "El servidor no está disponible en este momento. Intente más tarde.";
      toast.error(message);
    }
  };

  const removeAccessory = (id: number) => {
    setItemAccessories((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateAccessory = (accessory: any) => {
    setSaving(true);
    setError(null);

    const payload = {
      name: accessory,
      is_active: true,
    };

    axios
      .post(`${apiUrl}/accessories`, payload)
      .then((response) => {
        toast.success(response.data.message);
        //onSuccess();
        handleGetAccessories();
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message);
          toast.error(error.response.data.message);
        } else {
          setError(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
          toast.error(
            "El servidor no está disponible en este momento. Intente más tarde.",
          );
        }
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleAddAccessory = (accessory: any) => {
    setItemAccessories((prev) => {
      if (prev.some((a) => a.id === accessory.id)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: accessory.id,
          name: accessory.name,
        },
      ];
    });
  };

  const skeleton = (
    <div className="p-4 w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-1/3 h-6 bg-gray-300 rounded" />
        <div className="w-1/4 h-6 bg-gray-300 rounded" />
      </div>
      <div className="space-y-4">
        <div className="w-full h-4 bg-gray-300 rounded" />
        <div className="w-full h-4 bg-gray-300 rounded" />
        <div className="w-1/2 h-4 bg-gray-300 rounded" />
      </div>
    </div>
  );

  if (loading) {
    return skeleton;
  }

  return (
    <>
      <div className="relative">
        {saving && <SavingScreen />}
        <FormLayout title="" description="" onSubmit={handleSubmit}>
          {/* Tabs / Sections */}
          <FormTabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[
              { key: "general", label: "General" },
              ...(form?.type === ItemType.TOOL
                ? [
                    { key: "accessories", label: "Accesorios" },
                    { key: "units", label: "Unidades" },
                  ]
                : []),
            ]}
          />
          <FormTabPanel when="general" value={selectedTab}>
            <FormSection
              title="Información general"
              description="Datos básicos del articulo"
            >
              <FormRadioGroup
                label="Tipo"
                name="type"
                options={[
                  { value: "TOOL", label: "Equipo" },
                  { value: "SUPPLY", label: "Insumo" },
                ]}
                value={String(form?.type)}
                onChange={handleChange}
              />

              <FormField
                label="Nombre"
                name="name"
                value={form?.name}
                placeholder=""
                onChange={handleChange}
              />

              <div className="space-y-5">
                <FormField
                  label="Marca"
                  name="brand"
                  value={form?.brand}
                  placeholder=""
                  onChange={handleChange}
                />

                <FormField
                  label="Modelo"
                  name="model"
                  value={form?.model}
                  placeholder=""
                  onChange={handleChange}
                />
              </div>

              <FormSelectSearch
                label="Unidad"
                value={{
                  id: String(form?.unit_id),
                  name: form?.unit_name,
                }}
                placeholder=""
                options={units}
                onSelect={(unit) =>
                  setForm({ ...form, unit_id: unit.id, unit_name: unit.name })
                }
              />

              <FormField
                label="Stock mínimo"
                name="minimum_stock"
                type="number"
                value={String(form.minimum_stock)}
                placeholder=""
                onChange={handleChange}
              />

              <FormField
                label="Horas promedio de uso "
                name="usage_hours"
                type="number"
                value={String(form.usage_hours)}
                placeholder=""
                onChange={handleChange}
              />

              <FormSwitch
                label="Activo"
                name="is_active"
                value={form?.is_active}
                onChange={handleChange}
              />
            </FormSection>
          </FormTabPanel>

          {form?.type === ItemType.TOOL && (
            <FormTabPanel when="accessories" value={selectedTab}>
              <FormSection
                title="Accesorios"
                description="Accesorios relacionados al articulo"
              >
                <ItemCard item={form} />

                <Autocomplete
                  items={accessories}
                  placeholder="Agregar accesorio..."
                  onSelect={(item) => handleAddAccessory(item)}
                  onCreate={(name) => handleCreateAccessory(name)}
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {itemAccessories.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      No se han agregado accesorios
                    </p>
                  )}

                  {itemAccessories.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 px-3 py-1
                 bg-gray-100 text-sm text-gray-700
                 rounded-full"
                    >
                      <span>{a.name}</span>

                      <button
                        type="button"
                        onClick={() => removeAccessory(a.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="Quitar"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </FormSection>
            </FormTabPanel>
          )}

          {form?.type === ItemType.TOOL && (
            <FormTabPanel when="units" value={selectedTab}>
              <FormSection
                title="Unidades"
                description="Creacion y edicion de unidades del articulo"
              >
                <ItemCard item={form} />

                <div className="flex requisitions-center justify-between space-x-2">
                  <SearchBar
                    value={searchValue}
                    placeholder="Buscar por codigo..."
                    onChange={setSearchValue}
                  />

                  <button
                    type="button"
                    onClick={() => setShowItemUnitForm(true)}
                    className="flex items-center gap-2 bg-blue-400 text-white px-4 h-[40px] rounded-lg
                                           hover:bg-blue-500 transition text-sm font-medium"
                  >
                    <span className="text-lg">＋</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {filteredUnits.length === 0 ? (
                    <p className="text-sm text-gray-400 mt-2">
                      No se han agregado unidades o no coinciden con la búsqueda
                    </p>
                  ) : (
                    <div className="w-full">
                      <PagedDataGrid
                        data={filteredUnits}
                        page={1}
                        pageSize={1}
                        total={filteredUnits?.length}
                        pagination={false}
                        onLoadData={handleGetItemUnits}
                        onRowClick={(row: ItemUnitViewModel) => {
                          setSelectedItemUnit(row);
                          setShowItemUnitForm(true);
                        }}
                      >
                        <PagedDataGrid.Column
                          field="item_unit"
                          title="Unidades de artículo"
                        >
                          {(row: any) => (
                            <ItemUnitCard
                              key={row.id || row.tempId}
                              itemUnit={row}
                              item={form}
                            />
                          )}
                        </PagedDataGrid.Column>
                      </PagedDataGrid>
                    </div>
                  )}
                </div>
              </FormSection>
            </FormTabPanel>
          )}
        </FormLayout>
      </div>

      {/*ITEM UNIT FORM*/}
      {showItemUnitForm && (
        <Modal
          title="Unidad de artículo"
          open={showItemUnitForm}
          onClose={() => {
            setSelectedItemUnit(undefined);
            setShowItemUnitForm(false);
          }}
        >
          <ItemUnitForm
            item={form}
            itemUnit={selectedItemUnit}
            isParentEdit={isEdit}
            onAccept={(itemUnit: any) => {
              handleAcceptItemUnit(itemUnit);
              setSelectedItemUnit(undefined);
              setShowItemUnitForm(false);
            }}
            onSuccess={() => {
              handleGetItemUnits();
              setSelectedItemUnit(undefined);
              setShowItemUnitForm(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}
