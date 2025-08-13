import dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '..', '..', '**', '*.entity.ts')],
  migrations: [join(__dirname, 'migrations', '*.ts')],
  subscribers: [],
});
