// src/lib/auth/permissions.ts

import { UserRole } from "@/app/dashboard/persons/types/user-role.enum";
import { UserDto } from "@/app/types/auth/user.dto";

export const PERMISSIONS = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_USERS: "VIEW_USERS",
  VIEW_LOCATIONS: "VIEW_LOCATIONS",
  VIEW_ITEMS: "VIEW_ITEMS",
  VIEW_UNITS: "VIEW_UNITS",
  VIEW_REQUISITIONS: "VIEW_REQUISITIONS",
  VIEW_HOME: "VIEW_HOME",
} as const;

export const rolePermissions: Record<UserRole, readonly string[]> = {
  [UserRole.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.VIEW_ITEMS,
    PERMISSIONS.VIEW_UNITS,
    PERMISSIONS.VIEW_REQUISITIONS,
  ],
  [UserRole.ADMINISTRATIVE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_LOCATIONS,
    PERMISSIONS.VIEW_ITEMS,
    PERMISSIONS.VIEW_UNITS,
    PERMISSIONS.VIEW_REQUISITIONS,
  ],
  [UserRole.WAREHOUSE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REQUISITIONS
  ],
  [UserRole.CONTRACTOR]: [
    PERMISSIONS.VIEW_HOME
  ],
  [UserRole.CLIENT]: [
    PERMISSIONS.VIEW_HOME
  ]
};

export const hasPermission = (user: UserDto, permission: string) => {
  if (!user) return false;
  return rolePermissions[user.user_role]?.includes(permission);
};