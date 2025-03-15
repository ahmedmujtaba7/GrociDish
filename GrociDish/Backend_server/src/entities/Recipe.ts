import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'jsonb' })
  ingredients!: object; // JSONB field for storing ingredients

  @Column({ type: 'text' })
  directions!: string;

  @Column({ type: 'varchar', length: 50 })
  category!: 'BREAKFAST' | 'LUNCH/DINNER';

  @Column({ type: 'varchar', length: 50 })
  ingredientType!: 'Meat' | 'Vegetable' | 'Pulse-Based' | 'Other';

  @Column({ type: 'varchar', length: 50 })
  foodType!: 'Roti-Based' | 'Rice-Based' | 'Other';

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  caloriesPerServing!: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  carbohydrates!: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  proteins!: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  fats!: number;

  @Column({ type: 'text', nullable: true })
  picture!: string; // URL for recipe image

  @Column({ type: 'varchar', length: 50, default: 'None' })
  disease!: string; // Disease-specific recipes (if applicable)

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
