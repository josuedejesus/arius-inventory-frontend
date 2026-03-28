export interface CreateItemDto {
  name: string;
  brand: string;
  model: string;
  type: string;
  tracking: string;
  unit_id: number | null;
  is_active: boolean;
  minimum_stock?: number;
  accessories?: {
    id: number;
    name: string;
  }[];
  item_units?: any[];
}
