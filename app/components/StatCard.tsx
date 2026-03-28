import React, { ReactNode } from "react";

type StatCardProps = {
  title: string;
  count?: number;
  icon: ReactNode;
  onClick?: () => void;
  children: ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

export default function StatCard({
  title,
  count,
  icon,
  onClick,
  children,
  backgroundColor = "bg-white",
  textColor = "text-gray-900",
}: StatCardProps) {
  return (
    <div className={`${backgroundColor} rounded-xl border border-gray-100 p-5`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center justify-center rounded-lg p-3 ${textColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            {title}
          </p>
          {count !== undefined && (
            <p className="text-lg font-semibold text-gray-900">{count}</p>
          )}
        </div>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}
