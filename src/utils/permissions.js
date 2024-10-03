export const can = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};
