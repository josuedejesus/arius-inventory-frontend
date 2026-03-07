import { PERSON_ROLE_LABELS } from "@/constants/PersonRoles";
import { formatDate } from "../../utils/formatters";

type Person = {
  id: number;
  personname: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  updated_at: string;
  username: string;
};

type PersonCardProps = {
  person: Person;
  onClick: (person: Person) => void;
};

export default function PersonCard({ person, onClick }: PersonCardProps) {
  return (
    <div
      onClick={() => onClick(person)}
      className="bg-white cursor-pointer
             px-4 py-2 grid
             grid-cols-[2fr_2fr_3fr_1.5fr_1fr]
             items-center gap-4
             hover:bg-gray-50 text-sm"
    >
      {/* Nombre */}
      <p className="font-medium text-gray-800 truncate">{person.name}</p>

      {/* Usuario */}
      <p className="text-blue-400 truncate">{person.username || "—"}</p>

      {/* Contacto */}
      <div className="text-sm text-gray-600 truncate">
        <p className="truncate">{person.email}</p>
        <p className="truncate">{person.phone}</p>
      </div>

      {/* Rol */}
      <p className="text-sm text-gray-600 truncate">{PERSON_ROLE_LABELS[person.role]}</p>

      {/* Estado */}
      <div className="text-right">
        <p className="text-xs text-gray-400">{formatDate(person.updated_at)}</p>
      </div>
    </div>
  );
}
