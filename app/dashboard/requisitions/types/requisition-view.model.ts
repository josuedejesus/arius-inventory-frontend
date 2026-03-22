import { MovementType } from "./movement-type";
import { RequisitionStatus } from "./requisition-status.enum";
import { RequisitionType } from "./requisition-type.enum";
import { ReturnStatus } from "./return-status.enum";

export interface RequisitionViewModel {
  id: string;
  requested_by: string;
  destination_location_id?: number | null;
  movement: MovementType;
  type: RequisitionType;
  status: RequisitionStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  approved_at: string;
  executed_at: string;
  received_at: string;
  schedulled_at: string;
  approved_by: string;

  //extra
  requestor_name: string;
  approver_name: string;
  destination_location_name: string;
  destination_address: string;
  return_status: ReturnStatus;
}
