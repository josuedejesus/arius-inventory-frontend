import { RequisitionLinesService } from "@/app/services/requisition-lines.service";
import { RequisitionsService } from "@/app/services/requisitions.service";
import { useState } from "react";
import { toast } from "sonner";

export function useRequisitionLines() {
  const [loading, setLoading] = useState<boolean>(false);

  const withLoading = async (fn: () => Promise<any>) => {
    try {
      setLoading(true);
      return await fn();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Error del servidor");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getByRequisitionId = (id: number) =>
    withLoading(() => RequisitionLinesService.getByRequisitionId(id));

  return { getByRequisitionId };
}
