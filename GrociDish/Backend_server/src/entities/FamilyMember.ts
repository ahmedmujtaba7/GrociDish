// src/entities/FamilyMember.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Family } from './Family';
  
  @Entity('family_members')
  export class FamilyMember {
    @PrimaryGeneratedColumn()
    member_id!: number;
  
    // Foreign key to Family entity, establishing a many-to-one relationship
    @ManyToOne(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
    family!: Family;
  
    @Column({ type: 'varchar', length: 255 })
    name!: string;
  
    @Column({ type: 'int' })
    age!: number;

    @Column({ type: 'varchar', length: 10, nullable: true})
    password!: string;
  
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
  
    @Column({ type: 'boolean', default: false })
    groceryGenerator!: boolean;
  
    @Column({ type: 'boolean', default: false })
    recipeGenerator!: boolean;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  