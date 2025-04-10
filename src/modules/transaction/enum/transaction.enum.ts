export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum PaymentMethod {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  WITHDRAWAL = 'WITHDRAWAL',
}

export enum Currency {
  NGN = 'NGN',
}
