import React, { ReactNode } from "react";

type DataGridRowProps = {
  children: ReactNode;
  className?: string;
};

export function DataGridRow({ children, className }: DataGridRowProps) {
  return (
    <>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          className: `${child.props.className ?? ""} ${className ?? ""}`,
        }),
      )}
    </>
  );
}
