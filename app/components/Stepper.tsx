type StepperProps = {
  step: number;
};

export default function Stepper({ step }: StepperProps) {
  return (
    <div className="w-full flex items-center mb-8">
      {[1, 2, 3].map((s, idx) => {
        const isActive = step === s;
        const isCompleted = step > s;

        return (
          <div key={s} className="flex-1 flex items-center">
            {/* Círculo + Label */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
              w-9 h-9 flex items-center justify-center
              rounded-full text-sm font-semibold
              transition
              ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }
            `}
              >
                {s}
              </div>

              <span
                className={`
              mt-2 text-xs font-medium
              ${
                isCompleted
                  ? "text-green-600"
                  : isActive
                    ? "text-blue-600"
                    : "text-gray-400"
              }
            `}
              >
                {s === 1 && "General"}
                {s === 2 && "Artículos"}
                {s === 3 && "Resumen"}
              </span>
            </div>

            {/* Línea */}
            {idx < 2 && (
              <div
                className={`
              flex-1 h-[2px] mx-2 transition
              ${step > s ? "bg-green-500" : "bg-gray-200"}
            `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
