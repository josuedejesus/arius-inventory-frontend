import { formatDate } from "../../utils/formatters";

type Unit = {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  updated_at: string;
};

type UnitCardProps = {
  unit: Unit;
  onClick: (unit: Unit) => void;
};

export default function UnitCard({ unit, onClick }: UnitCardProps) {
  return (
    <div
      onClick={() => onClick(unit)}
      className="bg-white cursor-pointer rounded shadow
             px-4 py-2 grid
             grid-cols-2
             items-center gap-4
             hover:bg-gray-50"
    >
      {/* Nombre */}
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {unit?.name}
        </p>
      </div>
      {/* Codigo */}
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-medium text-blue-400 truncate">
          {unit?.code}
        </p>
      </div>{" "}
    </div>
  );
}
