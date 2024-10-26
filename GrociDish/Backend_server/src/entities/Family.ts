// src/entities/Family.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from './User';
  import { FamilyMember } from './FamilyMember';
  
  @Entity()
  export class Family {
    @PrimaryGeneratedColumn()
    family_id!: number;
  
    // Foreign key to User entity, setting a one-to-one relationship with the user
    @OneToOne(() => User, (user) => user.family, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @Column({ type: 'int', default: 0 })
    member_count!: number;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    // One-to-many relationship to FamilyMember, allowing multiple members to belong to a family
    @OneToMany(() => FamilyMember, (familyMember) => familyMember.family, {
      cascade: true,
    })
    members!: FamilyMember[];
  }
  