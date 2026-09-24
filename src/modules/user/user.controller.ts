import { Router, Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { validateDto } from '../../common/middlewares/validate';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

export const userRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

userRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json(await userService.list());
  })
);

userRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  })
);

userRouter.post(
  '/',
  validateDto(CreateUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  })
);

userRouter.put(
  '/:id',
  validateDto(UpdateUserDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await userService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updated);
  })
);

userRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await userService.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  })
);