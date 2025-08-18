export enum UserRole {
  ADMINISTRATORS = 'admin',
  MANAGERS = 'manager',
  EMPLOYEES = 'employee',
}

export const USER_ROLES = {
  ADMINISTRATORS: UserRole.ADMINISTRATORS,
  MANAGERS: UserRole.MANAGERS,
  EMPLOYEES: UserRole.EMPLOYEES,
} as const;

export type UserRoleType = keyof typeof USER_ROLES;
