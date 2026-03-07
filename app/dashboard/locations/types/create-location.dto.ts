import { LocationType } from "./location-type.enum";

export interface CreateLocationDto {
  name: string;
  type: LocationType;
  location: string;
  is_active: boolean;
  location_members?: any[];
}
