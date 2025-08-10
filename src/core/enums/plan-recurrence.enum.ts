export enum PlanRecurrence {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export const PLAN_RECURRENCE = {
  MONTHLY: PlanRecurrence.MONTHLY,
  YEARLY: PlanRecurrence.YEARLY,
} as const;

export type PlanRecurrenceType = keyof typeof PLAN_RECURRENCE;
