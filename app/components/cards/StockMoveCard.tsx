import { FaTruck } from "react-icons/fa";
import { GoPackageDependencies, GoPackageDependents } from "react-icons/go";

type StockMove = {
  id: string;
  quantity: string;
  executed_at?: string;
  received_at?: string;
  source_location_name?: string | null;
  destination_location_name?: string | null;
};

type StockMoveProps = {
  move: any;
};

export default function StockMoveCard({ move }: StockMoveProps) {
  const hasSource = Boolean(move.source_location_name);
  const hasDestination = Boolean(move.destination_location_name);

  return (
    <div className="">
      <div className="grid md:grid-cols-1 gap-4">
        {/* ENTRADA */}
        {move.destination_location_id === 3 ? (
          <div className="flex border rounded-lg p-4 bg-yellow-50 border-yellow-200 space-x-3">
            {/* ICONO */}
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <FaTruck className="text-sm" />
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-700">
                En tránsito
              </p>

              <p className="text-sm text-gray-700 font-medium">
                Ubicación:{" "}
                {move.destination_location_name}
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Cantidad: {move.quantity}</span>
              </div>

              <p className="text-xs text-gray-500 italic">
                Salida a tránsito
              </p>

              {(move.executed_at || move.received_at) && (
                <p className="text-xs text-gray-500">
                  {new Date(
                    move.received_at || move.executed_at!,
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          move.destination_location_name && (
            <div className="flex border rounded-lg p-4 bg-green-50 border-green-100 space-x-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                  <GoPackageDependents />
                </div>
              </div>

              <div className="gap-2">
                <p className="text-sm font-semibold text-green-700">Entrada</p>

                <p className="text-sm text-gray-700 font-medium">
                  Ubicacion: {move.destination_location_name}
                </p>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cantidad: {move.quantity}</span>
                </div>

                {move.received_at ? (
                  <p className="text-xs text-gray-500">
                    {new Date(move.received_at).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs text-yellow-600 italic">
                    Pendiente de recepción
                  </p>
                )}
              </div>
            </div>
          )
        )}

        {/* SALIDA */}

        {move.source_location_id === 3 ? (
          <div className="flex border rounded-lg p-4 bg-yellow-50 border-yellow-200 space-x-3">
            {/* ICONO */}
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <FaTruck className="text-sm" />
              </div>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-700">
                En tránsito
              </p>

              <p className="text-sm text-gray-700 font-medium">
                Ubicación:{" "}
                {move.source_location_name}
              </p>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Cantidad: {move.quantity}</span>
              </div>

              <p className="text-xs text-gray-500 italic">
                Llegada desde tránsito
              </p>

              {(move.executed_at || move.received_at) && (
                <p className="text-xs text-gray-500">
                  {new Date(
                    move.received_at || move.executed_at!,
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          move.source_location_name && (
            <div className="flex border rounded-lg p-4 bg-red-50 border-red-100 space-x-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                  <GoPackageDependencies />
                </div>
              </div>

              <div className="gap-2">
                <p className="text-sm font-semibold text-red-700">Salida</p>

                <p className="text-sm text-gray-700 font-medium">
                  Ubicacion: {move.source_location_name}
                </p>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cantidad: {move.quantity}</span>
                </div>

                {move.executed_at && (
                  <p className="text-xs text-gray-500">
                    {new Date(move.executed_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
