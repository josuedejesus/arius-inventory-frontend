import { ReactNode } from "react";

type DataGridCellProps = {
  children: ReactNode;
  className?: string;
};

export function DataGridCell({ children, className }: DataGridCellProps) {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 text-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}