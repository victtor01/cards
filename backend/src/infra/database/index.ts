import { Card } from '@core/domain/entities/card.entity';
import { Task } from '@core/domain/entities/task.entity';
import { User } from '@core/domain/entities/user.entity';
import { Workspace } from '@core/domain/entities/workspace.entity';
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
  entities: [User, Card, Task, Workspace],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  subscribers: [],
});
