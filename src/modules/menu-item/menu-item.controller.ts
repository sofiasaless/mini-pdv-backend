import { Router, Request, Response, NextFunction } from 'express';
import { menuItemService } from './menu-item.service';
import { validateDto } from '../../common/middlewares/validate';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { authMiddleware } from '../auth/middleware/auth.middleware';

export const menuItemRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

menuItemRouter.get(
  '/',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await menuItemService.listByRestaurant(req.user!.id));
  })
);

menuItemRouter.get(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const item = await menuItemService.findByIdScoped(req.params.id, req.user!.id);
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(item);
  })
);

menuItemRouter.post(
  '/',
  authMiddleware(),
  validateDto(CreateMenuItemDto),
  asyncHandler(async (req: Request, res: Response) => {
    req.body.restaurantRef = req.user!.id;
    const item = await menuItemService.create(req.body);
    res.status(201).json(item);
  })
);

menuItemRouter.put(
  '/:id',
  authMiddleware(),
  validateDto(UpdateMenuItemDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await menuItemService.updateScoped(
      req.params.id,
      req.user!.id,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(updated);
  })
);

menuItemRouter.delete(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await menuItemService.removeScoped(req.params.id, req.user!.id);
    if (!removed) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(204).send();
  })
);
