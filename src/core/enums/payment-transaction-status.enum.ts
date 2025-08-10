export enum PaymentTransactionStatus {
  APPROVED = 'approved',
  FAILED = 'failed',
  PENDING = 'pending',
}

export const PAYMENT_TRANSACTION_STATUS = {
  APPROVED: PaymentTransactionStatus.APPROVED,
  FAILED: PaymentTransactionStatus.FAILED,
  PENDING: PaymentTransactionStatus.PENDING,
} as const;

export type PaymentTransactionStatusType =
  keyof typeof PAYMENT_TRANSACTION_STATUS;
