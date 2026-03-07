import { PersonRole } from "./person-role.enums";

export interface UpdatePersonDto {
  name: string;
  phone: string;
  email: string;
  role: PersonRole;
  address: string;
  rtn: string;
  user_id?: number;
}