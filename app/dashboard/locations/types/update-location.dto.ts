import { LocationType } from "./location-type.enum";

export interface UpdateLocationDto {
  name: string;
  type: LocationType;
  location: string;
  is_active: boolean;
  location_members?: any[];
}
