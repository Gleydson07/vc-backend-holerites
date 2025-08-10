export enum AccessProfile {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export const ACCESS_PROFILE = {
  ADMIN: AccessProfile.ADMIN,
  MANAGER: AccessProfile.MANAGER,
  EMPLOYEE: AccessProfile.EMPLOYEE,
} as const;

export type AccessProfileType = keyof typeof ACCESS_PROFILE;
