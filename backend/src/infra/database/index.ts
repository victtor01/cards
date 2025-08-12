import dotenv from 'dotenv';
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
  entities: [__dirname + '/../../**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  subscribers: [],
});
