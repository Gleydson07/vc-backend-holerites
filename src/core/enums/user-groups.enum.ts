export enum UserGroups {
  ADMINISTRATORS = 'ADMINISTRATORS',
  MANAGERS = 'MANAGERS',
  EMPLOYEES = 'EMPLOYEES',
}

export const USER_GROUPS = {
  ADMINISTRATORS: UserGroups.ADMINISTRATORS,
  MANAGERS: UserGroups.MANAGERS,
  EMPLOYEES: UserGroups.EMPLOYEES,
} as const;

export type UserGroupType = keyof typeof USER_GROUPS;
