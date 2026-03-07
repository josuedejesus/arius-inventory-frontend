import { PersonRole } from "./person-role.enums";
import { UserRole } from "./user-role.enum";

export interface UserViewModel {
  id?: number;
  username: string;
  password?: string;
  role: UserRole;
  is_active: boolean;
  person_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
