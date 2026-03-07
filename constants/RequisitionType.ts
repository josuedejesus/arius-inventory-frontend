import { RequisitionType } from "@/app/dashboard/requisitions/types/requisition-type.enum";

export const REQUISITION_TYPE_LABELS: Record<RequisitionType, string> = {
    [RequisitionType.INTERNAL_TRANSFER]: 'Transferencia Interna',
    [RequisitionType.RENT]: 'Renta',
    [RequisitionType.SALE]: 'Venta',
    [RequisitionType.CONSUMPTION]: 'Consumo',
    [RequisitionType.RETURN]: 'Devolucion',
    [RequisitionType.ADJUSTMENT]: 'Ajuste',
    [RequisitionType.PURCHASE_RECEIPT]: 'Compra',
    [RequisitionType.TRANSFER]: 'Transferencia',
};