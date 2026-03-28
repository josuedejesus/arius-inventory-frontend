"use client";
import Button from "@/app/components/Button";
import StatCard from "@/app/components/StatCard";
import { LocationViewModel } from "@/app/dashboard/locations/types/location-view-model";
import { variant } from "@/constants/VariantEnum";
import {
  MdOutlineInventory2,
  MdOutlineAssignment,
  MdOutlineKeyboardReturn,
  MdOutlineHistory,
  MdInventory,
  MdLocationOn,
  MdRequestQuote,
  MdRequestPage,
  MdPending,
  MdPendingActions,
  MdAdd,
} from "react-icons/md";

// --- TIPOS ---
type OrderStatus = "PENDING" | "APPROVED" | "IN_PROGRESS" | "REJECTED";

type Order = {
  id: string;
  code: string;
  description: string;
  type: "EQUIPMENT" | "MATERIAL";
  status: OrderStatus;
  date: string;
};

type RentedItem = {
  id: string;
  internal_code: string;
  name: string;
  return_date: string; // ISO string
};

type DashboardSummary = {
  pending: number;
  in_progress: number;
  rented: number;
  due_soon: number;
  active_locations: number;
  total_item_units: number;
};

type Project = {
  id: string;
  name: string;
};

type ClientDashboardProps = {
  client_name: string;
  locations: LocationViewModel[]; // lista de proyectos del cliente
  activeLocation: LocationViewModel; // proyecto actualmente seleccionado
  onChangeLocation: (location: LocationViewModel) => void; // callback al cambiar
  summary: DashboardSummary;
  recent_orders: Order[];
  rented_items: RentedItem[];
  onNewEquipmentOrder: () => void;
  onNewMaterialOrder: () => void;
  onReturn: () => void;
  onViewHistory: () => void;
  onViewAllOrders: () => void;
  onViewAllItems: () => void;
};

// --- HELPERS ---
const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  APPROVED: {
    label: "Aprobada",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
  IN_PROGRESS: {
    label: "En proceso",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  REJECTED: {
    label: "Rechazada",
    className: "bg-red-50 text-red-700 border border-red-200",
  },
};

const ORDER_TYPE_LABELS: Record<Order["type"], string> = {
  EQUIPMENT: "Equipo",
  MATERIAL: "Material",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "short",
  });
}

function isDueSoon(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return diff > 0 && diff <= 5 * 24 * 60 * 60 * 1000; // 5 días
}

// --- SUBCOMPONENTES ---
function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = ORDER_STATUS_CONFIG[status];
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${className}`}
    >
      {label}
    </span>
  );
}

function MetricCard({
  value,
  label,
  dotColor,
}: {
  value: number;
  label: string;
  dotColor: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="flex items-center gap-1.5 mt-1">
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}
        />
        <span className="text-[11px] text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  sub,
  iconBg,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  iconBg: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 transition text-left w-full"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-400">{sub}</div>
      </div>
    </button>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function ClientDashboard({
  client_name,
  locations,
  activeLocation,
  onChangeLocation,
  summary,
  recent_orders,
  rented_items,
  onNewEquipmentOrder,
  onNewMaterialOrder,
  onReturn,
  onViewHistory,
  onViewAllOrders,
  onViewAllItems,
}: ClientDashboardProps) {
  return (
    <div className="space-y-5 text-gray-800">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          {/* Selector de proyecto */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs text-gray-400">Proyecto:</span>
            <div className="relative">
              <select
                value={activeLocation?.id}
                onChange={(e) => {
                  const selected = locations.find(
                    (p: any) => p.id === e.target.value,
                  );
                  if (selected) onChangeLocation(selected);
                }}
                className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg pl-2.5 pr-6 py-1 appearance-none cursor-pointer hover:border-gray-400 transition focus:outline-none"
              >
                {locations?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {/* Flecha del select */}
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <Button label="Nueva orden" onClick={onNewEquipmentOrder} variant={variant.dark} icon={<MdAdd/>}/>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2  lg:grid-cols-4 gap-4">
        <StatCard
          title="Equipo rentado"
          count={summary.total_item_units}
          icon={<MdInventory />}
          textColor="text-blue-400"
        >
          <div></div>
        </StatCard>

        <StatCard
          title="Proyectos activos"
          count={summary.active_locations}
          icon={<MdLocationOn />}
          textColor="text-green-400"
        >
          <div></div>
        </StatCard>

        <StatCard
          title="Solicitudes pendientes"
          count={0}
          icon={<MdPendingActions />}
          textColor="text-yellow-400"
        >
          <div></div>
        </StatCard>

        <StatCard
          title=""
          count={0}
          icon={<MdInventory />}
          textColor="text-orange-400"
        >
          <div></div>
        </StatCard>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-2 gap-4">
        {/* ÓRDENES RECIENTES */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">Órdenes recientes</span>
            <button
              type="button"
              onClick={onViewAllOrders}
              className="text-[11px] text-gray-400 hover:text-gray-700 font-mono transition"
            >
              ver todas →
            </button>
          </div>

          {recent_orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Sin órdenes recientes
            </div>
          ) : (
            recent_orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-gray-400 font-mono">
                    {order.code}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {order.description}
                  </span>
                  <span className="text-xs text-gray-400">
                    {ORDER_TYPE_LABELS[order.type]}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={order.status} />
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formatDate(order.date)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ARTÍCULOS EN PROYECTO */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">Artículos en proyecto</span>
            <button
              type="button"
              onClick={onViewAllItems}
              className="text-[11px] text-gray-400 hover:text-gray-700 font-mono transition"
            >
              ver todos →
            </button>
          </div>

          {rented_items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Sin artículos rentados
            </div>
          ) : (
            rented_items.map((item) => {
              const soon = isDueSoon(item.return_date);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <MdOutlineInventory2 size={15} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-400 font-mono">
                      {item.internal_code}
                    </div>
                    <div className="text-sm font-medium truncate">
                      {item.name}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border flex-shrink-0 ${
                      soon
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    Dev. {formatDate(item.return_date)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">Acciones rápidas</span>
          </div>
          <div className="grid grid-cols-4 gap-2 p-3">
            <QuickActionButton
              icon={<MdOutlineInventory2 size={15} className="text-blue-500" />}
              label="Solicitar equipo"
              sub="Herramientas y maquinaria"
              iconBg="bg-blue-50"
              onClick={onNewEquipmentOrder}
            />
            <QuickActionButton
              icon={
                <MdOutlineAssignment size={15} className="text-green-500" />
              }
              label="Solicitar material"
              sub="Consumibles e insumos"
              iconBg="bg-green-50"
              onClick={onNewMaterialOrder}
            />
            <QuickActionButton
              icon={
                <MdOutlineKeyboardReturn
                  size={15}
                  className="text-yellow-600"
                />
              }
              label="Devolver equipo"
              sub="Registrar devolución"
              iconBg="bg-yellow-50"
              onClick={onReturn}
            />
            <QuickActionButton
              icon={<MdOutlineHistory size={15} className="text-violet-500" />}
              label="Ver historial"
              sub="Todas mis órdenes"
              iconBg="bg-violet-50"
              onClick={onViewHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
