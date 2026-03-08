import React, { ReactNode } from "react";

type StatCardProps = {
  title: string;
  count: number;
  icon: ReactNode;
  onClick?: () => void;
  children: ReactNode;
};

export default function StatCard({
  title,
  count,
  icon,
  onClick,
  children,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center rounded-lg p-3 bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-900">{count}</p>
        </div>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  );
}
