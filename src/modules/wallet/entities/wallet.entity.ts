import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../common/entity/base.entity';
import { ColumnNumericTransformer } from '../../../common/transformers/numeric.transformer';
import { User } from '../../user/entities/user.entity';
import { Currency } from '../dto/create-wallet.dto';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.NGN })
  currency: Currency;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;
}
