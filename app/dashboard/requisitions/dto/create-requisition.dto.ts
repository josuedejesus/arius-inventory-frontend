import { MovementType } from "../types/movement-type";
import { RequisitionType } from "../types/requisition-type.enum";
import { CreateRequisitionLineDto } from "./create-requisition-line.dto";

export interface CreateRequisitionDto {
  requested_by: string;
  destination_location_id?: number | null;
  status: string;
  notes: string;
  type: RequisitionType;
  movement: MovementType;
  schedulled_at: string;
  lines: CreateRequisitionLineDto[];
}
