export enum PaymentStatus {
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export const PAYMENT_STATUS = {
  ACTIVE: PaymentStatus.ACTIVE,
  OVERDUE: PaymentStatus.OVERDUE,
  CANCELLED: PaymentStatus.CANCELLED,
} as const;

export type PaymentStatusType = keyof typeof PAYMENT_STATUS;
