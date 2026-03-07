import { RequisitionStatus } from "./requisition-status.enum";
import { RequisitionType } from "./requisition-type.enum";

export interface RequisitionViewModel {
  id: string;
  requested_by: string;
  destination_location_id: string;
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
  destination_location_name: any;
}
