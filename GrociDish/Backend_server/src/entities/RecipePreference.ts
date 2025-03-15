import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Family } from './Family';
import { Recipe } from './Recipe';

@Entity('recipe_preferences')
export class RecipePreference {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Family, { onDelete: 'CASCADE' })
  family!: Family;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE' })
  recipe!: Recipe;

  @Column({ type: 'varchar', length: 10 })
  preference!: 'LIKE' | 'DISLIKE'; // Enum-like check in DB

  @CreateDateColumn()
  created_at!: Date;
}
