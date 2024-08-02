import { AuthService } from '@core/application/services/auth-service';
import { AuthController } from '@src/infra/api/controllers/auth-controller';
import { Router } from 'express';
import { usersService } from './users-routers';
import { JwtService } from '@core/application/services/jwt-service';

const authRoutes = Router();

const jwtService = new JwtService();
const authService = new AuthService(usersService, jwtService);
const authController = new AuthController(authService);

authRoutes.post('/', (req, res) => authController.auth(req, res));

export { authRoutes };
