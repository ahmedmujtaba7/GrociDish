import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { HealthProfile } from './HealthProfile';
@Entity('caloric_information')
export class CaloricInformation {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => HealthProfile, (healthProfile) => healthProfile.caloricInformation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'health_profile_id' })
  healthProfile!: HealthProfile;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  required_calories!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  bmi!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  calories_consumed_per_day!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  calories_consumed_per_week!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  calories_consumed_per_month!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  required_fats!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  required_carbs!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  required_proteins!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  consumed_fats!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  consumed_carbs!: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
  consumed_proteins!: number | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
