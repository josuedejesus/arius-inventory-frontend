import { UserRole } from "@/app/dashboard/persons/types/user-role.enum";

export const getDefaultRouteByRole = (role: UserRole) => {
  switch (role) {
    case UserRole.CLIENT:
    case UserRole.CONTRACTOR:
      return "/home";

    case UserRole.ADMIN:
    case UserRole.ADMINISTRATIVE_MANAGER:
    case UserRole.WAREHOUSE_MANAGER:
      return "/dashboard";

    default:
      return "/login";
  }
};