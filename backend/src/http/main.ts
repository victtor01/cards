import 'express-async-errors';
import 'reflect-metadata';

import { AppDataSource } from '@infra/database';
import { ErrorMiddleware } from '@src/infra/api/middlewares/error.middleware';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

class Bootstrap {
  private port = 9000;

  public async start() {
    try {
      await AppDataSource.initialize();
      const app = express();
      
      app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

      app.use(cookieParser());
      app.use(express.json());
      app.use(bodyParser.json());
      

      app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
      }));

      app.use(routes);
      app.use(ErrorMiddleware);

      app.listen(this.port, () => {
        console.log('Servidor iniciado com sucesso!');
      });
    } catch (err) {
      console.error('Erro ao tentar conectar ao banco de dados!', err);
    }
  }
}

const bootstrap = new Bootstrap();

bootstrap.start();
