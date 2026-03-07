import { RequisitionLinesService } from "@/app/services/requisition-lines.service";
import { RequisitionsService } from "@/app/services/requisitions.service";
import { useState } from "react";
import { toast } from "sonner";

export function useRequisitions() {
  const [loading, setLoading] = useState<boolean>(false);

  const withLoading = async (fn: () => Promise<any>) => {
    try {
      setLoading(true);
      const result = await fn();
      return { success: true, data: result };
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Error del servidor");
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  const getById = (id: number) =>
    withLoading(() => RequisitionsService.getById(id));

  const update = (id: number, dto: any) =>
    withLoading(() => RequisitionsService.update(id, dto));

  const approve = (id: number) =>
    withLoading(() => RequisitionsService.approve(id));

  return { getById, update, approve, loading };
}
