import { CreateUserDto } from "./create-user.dto";
import { PersonRole } from "./person-role.enums";

export interface CreatePersonDto {
  name: string;

  role: PersonRole;

  phone: string;

  email?: string;

  address: string;

  rtn: string;

  user: CreateUserDto;
}
