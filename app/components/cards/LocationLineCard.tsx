type LocationLineCardProps = {
  line: any;
  onAdd: (line: any) => void;
};

export default function LocationLineCard({ line, onAdd }: any) {
  return (
    <div
      key={line.id}
      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onAdd(line)}
    >
      <div className="flex gap-4">
        {/* Imagen */}
        <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
          {line.image_path ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${line.image_path}`}
              alt={line.item_name}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-400 text-xl">🛠️</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {line.item_name}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Código: {line.internal_code}
              </p>
            </div>

            {/* Status */}
            <span
              className="px-2 py-1 text-xs font-medium rounded-full
                  bg-red-100 text-red-700"
            >
              {line.status}
            </span>
          </div>

          {/* Metadata */}
          <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs text-gray-600">
            <span>
              <strong>Marca:</strong> {line.brand}
            </span>
            <span>
              <strong>Condición:</strong> {line.condition}
            </span>
            <span>
              <strong>Ubicación:</strong> {line.location_name}
            </span>
            <span>
              <strong>Tracking:</strong> {line.tracking}
            </span>
          </div>

          {line.observations && (
            <p className="text-xs text-gray-500 mt-2">{line.observations}</p>
          )}
        </div>
      </div>
    </div>
  );
}
