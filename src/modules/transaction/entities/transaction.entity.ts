import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entity/base.entity';
import { User } from '../../user/entities/user.entity';
import {
  Currency,
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '../enum/transaction.enum';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  currency: Currency;

  @Column({ type: 'varchar', length: 255 })
  reference: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
