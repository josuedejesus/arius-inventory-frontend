import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "./permissions";

export const useCan = (permission: string) => {
  const { user } = useAuth();

  return hasPermission(user!, permission);
};