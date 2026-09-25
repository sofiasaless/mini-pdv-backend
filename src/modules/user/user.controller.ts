import { Router, Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { validateDto } from '../../common/middlewares/validate';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { authMiddleware } from '../auth/middleware/auth.middleware';

export const userRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

userRouter.get(
  '/',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const users = await userService.listByRestaurant(req.user!.id);
    res.json(users.map((user) => userService.sanitize(user)));
  })
);

userRouter.get(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findByIdScoped(req.params.id, req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(userService.sanitize(user));
  })
);

userRouter.post(
  '/',
  authMiddleware(),
  validateDto(CreateUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    req.body.restaurantRef = req.user!.id;
    const user = await userService.create(req.body);
    res.status(201).json(userService.sanitize(user));
  })
);

userRouter.put(
  '/:id',
  authMiddleware(),
  validateDto(UpdateUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await userService.updateScoped(
      req.params.id,
      req.user!.id,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(userService.sanitize(updated));
  })
);

userRouter.delete(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await userService.removeScoped(req.params.id, req.user!.id);
    if (!removed) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  })
);
