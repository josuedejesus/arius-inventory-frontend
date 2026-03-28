"use client";

import { useCan } from "@/app/lib/auth/useCan";


export default function PermissionGuard({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission: string;
}) {
  const can = useCan(permission);

  if (!can) return null;

  return children;
}