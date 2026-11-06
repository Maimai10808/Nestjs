import { Role } from './role.enum.js';
import { Permission } from './permission.enum.js';

export const ROLE_PERMISSIONS: Record<
  Role,
  Permission[]
> = {
  [Role.USER]: [
    Permission.AGENT_READ,
    Permission.AGENT_CREATE,
    Permission.AGENT_UPDATE,
    Permission.AGENT_DELETE,
    Permission.AGENT_EXECUTE,
  ],

  [Role.ADMIN]: Object.values(Permission),
};
