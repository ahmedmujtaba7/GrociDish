import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FamilyMember } from './FamilyMember';

@Entity('families')
export class Family {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  code!: string | null;

  @Column({ type: 'int', default: 0 })
  member_count!: number;

  @Column({ type: 'boolean', default: false })
  is_complete!: boolean;

  @OneToMany(() => FamilyMember, (familyMember) => familyMember.family)
  members!: FamilyMember[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
