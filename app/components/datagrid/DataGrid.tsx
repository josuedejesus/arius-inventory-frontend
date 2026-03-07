import React, { ReactNode, useMemo } from "react";

type DataGridProps = {
  children: ReactNode;
  className?: string;
};

export function DataGrid({ children, className = 'rounded-xl bg-white overflow-hidden border border-gray-200 shadow-sm' }: DataGridProps) {
  const rows = React.Children.toArray(children);

  const columnCount = useMemo(() => {
    const firstRow: any = rows[0];
    if (!firstRow) return 1;

    return React.Children.count(firstRow.props.children);
  }, [rows]);

  const gridTemplate = `repeat(${columnCount}, minmax(0,1fr))`;

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: gridTemplate,
      }}
    >
      {rows}
    </div>
  );
}