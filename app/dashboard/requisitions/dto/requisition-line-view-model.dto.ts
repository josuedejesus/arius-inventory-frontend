export interface RequisitionLineViewModel {
    id: number;
    requisition_id: number;
    item_id: number;
    item_unit_id?: number | null;
    quantity: number;
    created_at: string;
    updated_at: string;
    return_of_line_id?: number | null;
    source_location_id: number;
    destination_location_id: number;
    is_deleted: boolean;
    deleted_at?: string | null;
    //item details
    name: string;
    brand?: string | null;
    model?: string | null;
    internal_code?: string | null;
    location_id: number;
    status: string;
    //unit details
    unit_code: string;
    unit_name: string;
    //locations details
    source_location_name: string;
    destination_location_name: string;
    //extra details
    photos_count: number;
    has_return: boolean;
    accessories: any[];
}
