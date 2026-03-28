import { ItemUnitStatus } from "@/app/components/item-units/types/item-units-status.enum";
import { ItemType } from "./item-type.enum";
import { ItemUnitType } from "@/app/components/item-units/types/item-unit-type.enum";

export interface ItemUnitViewModel {
  //item_unit
  id?: number | null;
  item_id?: number | null;
  serial_number: string;
  internal_code: string;
  status: ItemUnitStatus;
  condition: string;
  location_id?: number | null;
  observations: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  image_path: string;

  //extras item
  name: string;
  brand: string;
  model: string;
  type: ItemUnitType;

  //extras location
  location_name: string;

  //extras stats
  days_in_project?: number | null;
  estimated_usage_hours?: number | null;
}
