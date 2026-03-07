import { PersonRole } from "./person-role.enums";
import { UserRole } from "./user-role.enum";

export interface CreateUserDto {
  username: string;

  password: string;

  is_active: boolean;

  role: UserRole
}
