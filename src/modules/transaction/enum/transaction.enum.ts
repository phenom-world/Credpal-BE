export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
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
}

export enum Currency {
  NGN = 'NGN',
}
