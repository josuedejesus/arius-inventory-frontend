import { IoMdCamera, IoMdReturnLeft, IoMdWarning } from "react-icons/io";
import {
  MdPendingActions,
  MdCheckCircleOutline,
  MdOutlineCancel,
  MdNoPhotography,
} from "react-icons/md";
import { RequisitionType } from "../types/requisition-type.enum";
import { DataGridRow } from "@/app/components/datagrid/DataGridRow";
import { DataGridCell } from "@/app/components/datagrid/DataGridCell";
import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { RequisitionStatus } from "../types/requisition-status.enum";

type RequisitionLineCardProps = {
  line: any;
  requisition?: any;
  onClick?: (line: any) => void;
  onRemove?: (line: any) => void;
  onPhotos?: (line: any) => void;
};

export default function RequisitionLineCard({
  line,
  requisition,
  onClick,
  onRemove,
  onPhotos,
}: RequisitionLineCardProps) {
  console.log("line", line);
  const isAvailable = (() => {
    if (!line) return false;

    switch (requisition?.type) {
      case RequisitionType.ADJUSTMENT:
      case RequisitionType.PURCHASE_RECEIPT:
        return line.status === ItemUnitStatus.AVAILABLE;

      case RequisitionType.RENT:
        return (
          line.source_location_id === line.location_id &&
          (line.status === ItemUnitStatus.AVAILABLE ||
            (line.status === ItemUnitStatus.RESERVED &&
              line.reserved_requisition_id === requisition.id))
        );

      case RequisitionType.RETURN:
      case RequisitionType.TRANSFER:
        return (
          line.source_location_id === line.location_id &&
          line.status === ItemUnitStatus.RENTED
        );

      default:
        return false;
    }
  })();

  return (
    <DataGridRow
      key={line.id}
      className="group cursor-pointer hover:bg-gray-50/70 transition-colors"
    >
      {/* Artículo */}
      <DataGridCell>
        <div className="min-w-0 space-y-1">
          <span className="block text-[10px] font-mono font-semibold text-gray-400 tracking-widest uppercase">
            {line?.internal_code || line?.id}
          </span>

          <span className="block font-semibold text-gray-800 truncate leading-tight">
            {line?.item_name}
          </span>

          {(line?.item_brand || line?.item_model) && (
            <p className="text-xs text-gray-400 truncate leading-tight">
              {[line?.item_brand, line?.item_model].filter(Boolean).join(" · ")}
            </p>
          )}

          {line?.accessories?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {line.accessories.map((a: any) => (
                <span
                  key={a?.id}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  <span className="font-semibold text-gray-600">
                    {a?.quantity}×
                  </span>
                  {a?.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </DataGridCell>

      {/* Cantidad */}
      <DataGridCell className="flex items-center justify-startfont-semibold h-full text-gray-800">
        {line?.quantity} {line?.unit_code}
      </DataGridCell>

      {/* Ubicación */}
      <DataGridCell>
        <div className="flex justify-center items-center h-full gap-1 min-w-0 ">
          {line?.source_location_name ? (
            <>
              <span className="text-xs text-gray-500 truncate">
                {line.source_location_name}
              </span>

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>

              <span className="text-xs text-gray-500 truncate">
                {line.destination_location_name}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 shrink-0"
              >
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>

              <span className="text-xs text-gray-500 truncate">
                {line.destination_location_name}
              </span>
            </div>
          )}
        </div>
      </DataGridCell>

      <DataGridCell className="flex items-center gap-2">
        {/* Disponibilidad */}
        {requisition?.status === RequisitionStatus.DRAFT && (
          <span
            className={`inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium
      ${
        isAvailable
          ? "text-emerald-600 bg-emerald-50"
          : "text-red-600 bg-red-50"
      }
    `}
          >
            {isAvailable ? (
              <>
                <MdCheckCircleOutline className="text-sm" />
                {line.available_quantity}
              </>
            ) : (
              <>
                <MdOutlineCancel className="text-sm" />0
              </>
            )}
          </span>
        )}

        {/* Fotos */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPhotos?.(line);
          }}
          className={`inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium transition-colors
    ${
      line?.photos_count > 0
        ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
        : "text-amber-600 bg-amber-50 hover:bg-amber-100"
    }
    opacity-50 group-hover:opacity-100
  `}
        >
          {line?.photos_count > 0 ? (
            <>
              <IoMdCamera className="text-sm" />
              <span>{line.photos_count}</span>
            </>
          ) : (
            <>
              <MdNoPhotography className="text-sm" />
            </>
          )}
        </button>

        {/* Retorno */}
        {(requisition?.type === RequisitionType.RENT ||
          requisition?.type === RequisitionType.TRANSFER) && (
          <span
            className={`inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium
      ${
        line?.return_of_id
          ? "text-emerald-600 bg-emerald-50"
          : "text-amber-600 bg-amber-50"
      }
    `}
          >
            {line?.return_of_id ? (
              <IoMdReturnLeft className="text-sm" />
            ) : (
              <MdPendingActions className="text-sm" />
            )}
          </span>
        )}
      </DataGridCell>

      {/* Acción */}
      <DataGridCell className="flex justify-center items-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(line);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-50 group-hover:opacity-100"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </DataGridCell>
    </DataGridRow>
  );
}
