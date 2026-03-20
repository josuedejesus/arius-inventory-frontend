import { PersonRole } from "./person-role.enums";

export interface PersonViewModel {
    id?: number;
    name: string;
    phone: string;
    email: string;
    role: PersonRole;
    created_at?: Date;
    updated_at?: Date;
    address: string;
    rtn: string;
    //user
    username: string;
}