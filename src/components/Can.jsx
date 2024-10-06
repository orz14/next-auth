import { usePermissions } from "@/hooks/usePermissions";
import { can } from "@/utils/permissions";

export default function Can({ permission, children }) {
  const userPermissions = usePermissions();

  if (!can(userPermissions, permission)) {
    return null;
  }

  return <>{children}</>;
}
