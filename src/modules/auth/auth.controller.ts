import { Router, Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { validateDto } from '../../common/middlewares/validate';
import { LoginRestaurantDto } from './dto/loginRestaurant.dto';

export const authRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

authRouter.post(
  '/login',
  validateDto(LoginRestaurantDto),
  asyncHandler(async (req: Request, res: Response) => {
    const token = await authService.login(req.body);
    res.json({ token });
  })
);