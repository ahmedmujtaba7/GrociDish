import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import * as dotenv from 'dotenv';
import { Family } from '../entities/Family';
import { HealthProfile } from '../entities/HealthProfile';
import { FamilyMember } from '../entities/FamilyMember';
dotenv.config();
// Set up PostgreSQL connection using TypeORM
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Family, HealthProfile, FamilyMember],
  synchronize: true,  // Automatically syncs the schema, avoid this in production
});
