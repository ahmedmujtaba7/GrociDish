import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Family } from './Family';
import { User } from './User';

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family!: Family;

  @ManyToOne(() => User, (user) => user.family, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'boolean', default: false })
  is_owner!: boolean;

  @Column({ type: 'boolean', default: false })
  is_grocery_generator!: boolean;

  @Column({ type: 'boolean', default: false })
  is_recipe_selector!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
