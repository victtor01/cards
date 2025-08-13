import dotenv from 'dotenv';

dotenv.config();

import 'express-async-errors';
import 'reflect-metadata';

import { AppDataSource } from '@infra/database';
import { ErrorMiddleware } from '@src/infra/api/middlewares/error.middleware';
import logger from '@src/utils/logger';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes';

class Bootstrap {
  private static port = process.env.PORT || 9000;
  
  public static async start() {
    try {
      await AppDataSource.initialize();
      const app = express();

      app.set('trust proxy', 1);

      app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

      app.use(cookieParser());
      app.use(express.json());
      app.use(bodyParser.json());

      app.use(
        cors({
          origin: [process.env.FRONTEND_URL],
          credentials: true,
        })
      );

      app.use(routes);
      app.use(ErrorMiddleware);

      app.listen(this.port, () => {
        logger.info('Servidor iniciado com sucesso!');
      });
    } catch (err) {
      logger.error({ err }, 'Erro ao tentar conectar ao banco de dados!');
    }
  }
}

Bootstrap.start();
