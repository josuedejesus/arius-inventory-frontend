import { formatDate } from "../../../utils/formatters";

type Step = {
  label: string;
  date?: string;
};

export default function RequisitionTimeline({
  created_at,
  approved_at,
  executed_at,
  received_at,
}: {
  created_at?: string;
  approved_at?: string;
  executed_at?: string;
  received_at?: string;
}) {
  const steps: Step[] = [
    { label: "Creado", date: created_at },
    { label: "Aprobado", date: approved_at },
    { label: "Despachado", date: executed_at },
    { label: "Recibido", date: received_at },
  ];

  const currentStep = steps.reduce(
    (acc, step, i) => (step.date ? i : acc),
    0
  );

  return (
    <div className="flex items-center w-full mt-6">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <div key={idx} className="flex-1 flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center flex-1">

              <div
                className={`
                w-9 h-9 flex items-center justify-center
                rounded-full text-sm font-semibold transition
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
              >
                {idx + 1}
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
                {step.label}
              </span>

              {step.date && (
                <span className="text-[10px] text-gray-400 mt-1">
                  {formatDate(step.date)}
                </span>
              )}

            </div>

            {/* Line */}
            {idx < steps.length - 1 && (
              <div
                className={`
                flex-1 h-[2px] mx-2 transition
                ${idx < currentStep ? "bg-green-500" : "bg-gray-200"}
              `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}