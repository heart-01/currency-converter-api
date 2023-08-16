import { ExchangeRate } from 'src/services/exchange-rate/entities/exchange-rate.entity';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'currency' })
@Unique(['country'])
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, nullable: false })
  name: string;

  @Column({ length: 15, nullable: false })
  country: string;

  @OneToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.from_currency_id)
  @JoinColumn()
  fromExchangeRate: ExchangeRate;

  @OneToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.to_currency_id)
  @JoinColumn()
  toExchangeRate: ExchangeRate;

  @CreateDateColumn({ name: 'created_at' })
  created: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated: Date;
}
