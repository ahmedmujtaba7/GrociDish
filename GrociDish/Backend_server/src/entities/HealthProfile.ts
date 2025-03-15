import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CaloricInformation } from './CaloricInformation';
import { User } from './User';

@Entity('health_profiles')
export class HealthProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int', nullable: true })
  age!: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height!: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  activity_level!: string;

  @Column({ type: 'varchar', array: true, default: '{}' })
  diseases!: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calories_tracked!: number;

  @OneToOne(() => CaloricInformation, (caloricInformation) => caloricInformation.healthProfile, { cascade: true })
  caloricInformation!: CaloricInformation;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
