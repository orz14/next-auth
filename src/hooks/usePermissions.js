import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export const usePermissions = () => {
  const { user } = useContext(AuthContext);
  return user?.permissions || [];
};
