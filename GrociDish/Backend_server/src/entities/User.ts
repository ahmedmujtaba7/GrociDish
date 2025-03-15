// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Family } from './Family';
import { HealthProfile } from './HealthProfile';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string;

  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true })
  verification_code!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  code_expiry!: Date | null;

  @Column({ type: 'text', nullable: true })
  refresh_token!: string | null; // Optional column for storing refresh tokens

  @ManyToOne(() => Family, (family) => family.members, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'family_id' }) // Use a clear name for the foreign key column
  family!: Family | null;

  @OneToOne(() => HealthProfile, (healthProfile) => healthProfile.user, { cascade: true })
  healthProfile!: HealthProfile;


  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
