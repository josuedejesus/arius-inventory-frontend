
export interface AddedLineViewModel {
    id: number;
    item_key: string;
    item_id: number;
    item_unit_id?: number | null;
    name: string;
    brand?: string | null;
    model?: string | null;
    internal_code?: string | null;
    available_quantity?: number;
    image_path?: string | null;
    //extras
    quantity: number;
    unit_code: string;
    unit_name: string;
    return_of_id?: number | null;
    accessories?: any[];
    source_location_id?: number;
    source_location_name?: string;
    destination_location_id?: number;
    destination_location_name?: string;
}