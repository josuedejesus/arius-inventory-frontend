import { ItemType } from "./item-type.enum";

export interface ItemViewModel {
  id?: number;
  brand: string;
  name: string;
  model: string;
  type: ItemType;
  tracking: string;
  unit_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  image_path: string;
  minimum_stock?: number;
  usage_hours: number;
  //extras
  unit_name: string;
  unit_code: string;
}
