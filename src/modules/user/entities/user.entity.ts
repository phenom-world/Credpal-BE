import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entity/base.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { UserRole } from '../enum/user.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  tocAgreed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;
}
