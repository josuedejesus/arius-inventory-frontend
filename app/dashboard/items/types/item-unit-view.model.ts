import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { ItemType } from "./item-type.enum";
import { ItemUnitType } from "@/app/components/item-units/types/item-unit-type.enum";

export interface ItemUnitViewModel {
  brand: string;
  condition: string;
  created_at: string;
  description: string;
  id?: number | null;
  image_path: string;
  internal_code: string;
  is_active: boolean;
  item_id?: number | null;
  location_id? : number | null;
  location: string;
  model: string;
  name: string;
  observations: string;
  serial_number: string;
  status: ItemUnitStatus;
  updated_at: string;
  type: ItemUnitType;
  location_name: string;
}
