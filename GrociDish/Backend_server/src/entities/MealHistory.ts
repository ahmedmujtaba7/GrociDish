import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Family } from './Family';
import { Recipe } from './Recipe';

@Entity('meal_history')
export class MealHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  family!: Family;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  recipe!: Recipe;

  @Column({ type: 'varchar', length: 20 })
  mealType!: string; // "BREAKFAST", "LUNCH", "DINNER"

  @Column({ type: 'boolean', default: false })
  selected!: boolean; // If the family accepted this meal

  @CreateDateColumn()
  created_at!: Date;
}
