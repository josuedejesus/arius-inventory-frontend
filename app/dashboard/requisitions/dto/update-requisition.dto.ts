import { RequisitionType } from "../types/requisition-type.enum";
import { CreateRequisitionLineDto } from "./create-requisition-line.dto";

export interface UpdateRequisitionDto {
  requested_by: string;
  destination_location_id: string;
  type: RequisitionType;
  status: string;
  notes: string;
  schedulled_at: string;
  lines: CreateRequisitionLineDto[];
}
