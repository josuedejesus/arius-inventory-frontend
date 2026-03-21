import React, { useEffect, useRef, useCallback } from "react";
import { formatDate } from "../../../utils/formatters";
import { MdCheck } from "react-icons/md";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  const steps: Step[] = [
    { label: "Creado", date: created_at },
    { label: "Aprobado", date: approved_at },
    { label: "Despachado", date: executed_at },
    { label: "Recibido", date: received_at },
  ];

  const currentStep = steps.reduce((acc, step, i) => (step.date ? i : acc), 0);

  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const dots = container.querySelectorAll<HTMLElement>("[data-dot]");
    const containerRect = container.getBoundingClientRect();

    linesRef.current.forEach((line, idx) => {
      const dotA = dots[idx];
      const dotB = dots[idx + 1];
      if (!dotA || !dotB || !line) return;

      const rectA = dotA.getBoundingClientRect();
      const rectB = dotB.getBoundingClientRect();

      const x1 = rectA.right - containerRect.left;
      const x2 = rectB.left - containerRect.left;
      const y = rectA.top + rectA.height / 2 - containerRect.top;

      line.style.left = `${x1}px`;
      line.style.top = `${y}px`;
      line.style.width = `${x2 - x1}px`;
    });
  }, []);

  useEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [updateLines]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-between items-start w-full mt-4 pt-3"
    >
      {/* Líneas (posicionadas absolutamente, detrás de los puntos) */}
      {steps.slice(0, -1).map((_, idx) => {
        const isCompleted = idx < currentStep;
        return (
          <div
            key={`line-${idx}`}
            ref={(el) => {
              if (el) linesRef.current[idx] = el;
            }}
            className="absolute h-0.5 bg-gray-200 z-0"
            style={{ top: 0, left: 0, width: 0 }} // actualizado por updateLines
          >
            <div
              className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                isCompleted ? "bg-green-500 w-full" : "w-0"
              }`}
            />
          </div>
        );
      })}

      {/* Columnas de cada paso */}
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isActive = idx <= currentStep;

        return (
          <div
            key={step.label}
            className="relative z-10 flex flex-col items-center flex-1 text-center"
          >
            {/* Punto */}
            <div
              data-dot
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isCurrent
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {isCompleted ? <MdCheck size={15} /> : isCurrent ? idx + 1 : ""}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs font-medium ${
                isActive
                  ? isCurrent
                    ? "text-blue-500"
                    : "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {/* Fecha */}
            {step.date && (
              <span className="text-[10px] text-gray-400 mt-1">
                {formatDate(step.date)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
