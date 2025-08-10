export enum PaymentMethod {
  PIX = 'pix',
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
}

export const PAYMENT_METHOD = {
  PIX: PaymentMethod.PIX,
  DEBIT_CARD: PaymentMethod.DEBIT_CARD,
  CREDIT_CARD: PaymentMethod.CREDIT_CARD,
} as const;

export type PaymentMethodType = keyof typeof PAYMENT_METHOD;
