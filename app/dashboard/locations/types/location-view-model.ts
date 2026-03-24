import { LocationType } from "./location-type.enum";

export interface LocationViewModel {
  id?: number;
  name: string;
  type: LocationType;
  location: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;

  //members
  member_count: number;
}
