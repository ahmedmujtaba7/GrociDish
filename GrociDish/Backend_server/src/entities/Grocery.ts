import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { Family } from "./Family";
  
  @Entity("grocery_lists")
  export class GroceryList {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => Family, (family) => family.groceryLists, { onDelete: "CASCADE" })
    @JoinColumn({ name: "family_id" })
    family!: Family;
  
    @Column({ type: "int" })
    budget!: number;
  
    @Column({ type: "jsonb" })
    grocery_list!: object; // Stores the full grocery list response from Flask API
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  