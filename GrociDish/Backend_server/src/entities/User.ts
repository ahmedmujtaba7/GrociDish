import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { Family } from './Family';
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;
  
    @Column({ type: 'varchar', length: 255 })
    password!: string;

    @Column({ type: 'boolean', default: false })
    is_verified!: boolean;

    @Column({ type: 'varchar', length: 6, nullable: true })
    verification_code!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    code_expiry!: Date | null;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date;

    // Establish a one-to-one relationship with Family
  // This relationship allows each user to be associated with a single family.
  // We use `cascade: true` to automatically create a family when a new user is registered.
    @OneToOne(() => Family, (family) => family.user, { cascade: true })
    family!: Family;
  }
  