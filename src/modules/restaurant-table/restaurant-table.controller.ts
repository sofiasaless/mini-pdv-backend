import { Router, Request, Response, NextFunction } from 'express';
import { restaurantTableService } from './restaurant-table.service';
import { validateDto } from '../../common/middlewares/validate';
import {
  CreateRestaurantTableDto,
  CreateManyRestaurantTableDto,
  UpdateRestaurantTableDto,
} from './dto/restaurant-table.dto';
import { authMiddleware } from '../auth/middleware/auth.middleware';

export const restaurantTableRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

restaurantTableRouter.get(
  '/',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await restaurantTableService.listByRestaurant(req.user!.id));
  })
);

restaurantTableRouter.get(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const table = await restaurantTableService.findByIdScoped(
      req.params.id,
      req.user!.id,
    );
    if (!table) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.json(table);
  })
);

restaurantTableRouter.post(
  '/bulk',
  authMiddleware(),
  validateDto(CreateManyRestaurantTableDto),
  asyncHandler(async (req: Request, res: Response) => {
    const tables = await restaurantTableService.createMany(
      req.body.quantity,
      req.user!.id,
    );
    res.status(201).json(tables);
  })
);

restaurantTableRouter.post(
  '/',
  authMiddleware(),
  validateDto(CreateRestaurantTableDto),
  asyncHandler(async (req: Request, res: Response) => {
    req.body.restaurantRef = req.user!.id;
    const table = await restaurantTableService.create(req.body);
    res.status(201).json(table);
  })
);

restaurantTableRouter.put(
  '/:id',
  authMiddleware(),
  validateDto(UpdateRestaurantTableDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await restaurantTableService.updateScoped(
      req.params.id,
      req.user!.id,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.json(updated);
  })
);

restaurantTableRouter.delete(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await restaurantTableService.removeScoped(
      req.params.id,
      req.user!.id,
    );
    if (!removed) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.status(204).send();
  })
);
