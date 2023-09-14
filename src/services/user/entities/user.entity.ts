import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
  BeforeInsert,
  Check,
  BeforeUpdate,
  DeleteDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'user' })
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 20, nullable: false })
  username: string;

  @Column({ length: 70, nullable: false })
  email: string;

  @Column({ default: 'noimg.png' })
  image: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: 'USER' })
  @Check("role IN ('USER', 'ADMIN')")
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  created: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @BeforeInsert()
  setRole() {
    this.role = this.role?.toUpperCase();
  }

  @BeforeUpdate()
  updateRole() {
    this.role = this.role?.toUpperCase();
  }

  async verifyPassword(password: string) {
    const hashPassword = await bcrypt.hash(password, this.salt);
    return this.password === hashPassword;
  }
}
