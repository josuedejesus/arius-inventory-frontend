export interface RequisitionDto {
    requested_by: string
    source_location_id: string
    destination_location_id: string
    type: string
    status: string
    notes: string
    schedulled_at: string
    lines: {
        item_id: string,
        item_unit_id: string,
        quantity: string,
        accessories: any[],
    }[]
}