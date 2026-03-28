import { PersonRole } from "@/app/dashboard/persons/types/person-role.enums";
import { UserRole } from "@/app/dashboard/persons/types/user-role.enum";

export type UserDto = {
  person_id: string;
  name: string;
  email: string;
  phone: string;
  person_role: PersonRole;
  user_id: string;
  username: string;
  user_role: UserRole;
};
