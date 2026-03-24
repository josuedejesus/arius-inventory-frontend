import React from "react";
import { IconType } from "react-icons";

type Props = {
  message: string;
  icon?: React.ReactNode | IconType;
};
export default function EmptyList({ message, icon }: Props) {
  return (
    <div className="py-10">
      {icon && (
        <div className="flex items-center justify-center mb-3 text-gray-400">
          {typeof icon === "function" ? React.createElement(icon) : icon}
        </div>
      )}
      <p className="text-sm font-medium text-gray-700 text-center">{message}</p>
    </div>
  );
}
