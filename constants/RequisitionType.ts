import { RequisitionType } from "@/app/dashboard/requisitions/types/requisition-type.enum";

export const REQUISITION_TYPE_LABELS: Record<RequisitionType, {
    label: string;
    description?: string;
}> = {
    [RequisitionType.INTERNAL_TRANSFER]: { label: 'Transferencia Interna', description: 'Movimiento de unidades entre ubicaciones dentro de la organización.' },
    [RequisitionType.RENT]: { label: 'Renta', description: 'Solicitud de unidades para uso temporal, generalmente con fecha de devolución.' },
    [RequisitionType.SALE]: { label: 'Venta', description: 'Solicitud de unidades para venta a clientes externos.' },
    [RequisitionType.CONSUMPTION]: { label: 'Consumo', description: 'Solicitud de unidades para consumo interno.' },
    [RequisitionType.RETURN]: { label: 'Devolucion', description: 'Devolución de unidades previamente solicitadas.' },
    [RequisitionType.ADJUSTMENT]: { label: 'Ajuste', description: 'Ajuste de inventario debido a discrepancias.' },
    [RequisitionType.PURCHASE_RECEIPT]: { label: 'Recepción de Compra', description: 'Recepción de unidades adquiridas.' },
    [RequisitionType.TRANSFER]: { label: 'Transferencia', description: 'Transferencia de unidades entre proyectos.' },
};