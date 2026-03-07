import { USER_ROLE_LABELS } from "@/constants/UserRoles";
import { formatDate } from "../../utils/formatters";

type User = {
  id: number;
  username: string;
  name: string;
  role: string;
  is_active: boolean;
  updated_at: string;
};

type UserCardProps = {
    user: User,
    onClick: (user: User) => void
}

export default function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div
      onClick={() => onClick(user)}
      className="bg-white cursor-pointer 
             px-4 py-2 grid
             grid-cols-[2fr_2fr_1.5fr_1fr]
             items-center gap-4
             hover:bg-gray-50 text-sm"
    >
      {/* Nombre */}
      <p className="font-medium text-gray-800 truncate">{user.name}</p>

      {/* Usuario */}
      <p className=" text-blue-400 truncate">{user.username || "—"}</p>


      {/* Rol */}
      <p className="text-sm text-gray-600 truncate">{USER_ROLE_LABELS[user.role]}</p>

      {/* Estado */}
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            user.is_active ? "text-green-600" : "text-red-500"
          }`}
        >
          {user.is_active ? "Activo" : "Inactivo"}
        </p>
      </div>
    </div>
  );
}
