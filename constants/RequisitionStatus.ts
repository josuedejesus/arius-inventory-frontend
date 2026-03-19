import { variant } from "./VarianEnum";


export const REQUISITION_STATUS_LABELS: Record<
  string,
  {
    label: string;
    className: variant;
  }
> = {
  DRAFT: { label: "Borrador", className: variant.neutral },
  APPROVED: { label: "Aprobado", className: variant.info },
  IN_PROGRESS: { label: "En Proceso", className: variant.warning },
  DONE: { label: "Finalizado", className: variant.success },
  CANCELLED: { label: "Cancelado", className: variant.danger },
};
