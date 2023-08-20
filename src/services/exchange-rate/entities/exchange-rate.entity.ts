import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Currency } from 'src/services/currency/entities/currency.entity';

@Entity({ name: 'exchange_rate' })
export class ExchangeRate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Currency, (currency) => currency.fromExchangeRate, {
    nullable: false,
  })
  @JoinColumn({ name: 'from_currency_id' })
  fromCurrency: Currency;

  @ManyToOne(() => Currency, (currency) => currency.toExchangeRate, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_currency_id' })
  toCurrency: Currency;

  @Column({ nullable: false })
  rate: number;

  @CreateDateColumn({ name: 'created_at' })
  created: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated: Date;
}
