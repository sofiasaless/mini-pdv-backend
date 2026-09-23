import { Router, Request, Response, NextFunction } from 'express';
import { restaurantTableService } from './restaurant-table.service';

export const restaurantTableRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

restaurantTableRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json(await restaurantTableService.list());
  })
);

restaurantTableRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const table = await restaurantTableService.findById(req.params.id);
    if (!table) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.json(table);
  })
);

restaurantTableRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { restaurantRef, number } = req.body;
    if (!restaurantRef || typeof number !== 'number') {
      res.status(400).json({
        message: 'Required fields: restaurantRef, number (number)',
      });
      return;
    }
    const table = await restaurantTableService.create({ restaurantRef, number });
    res.status(201).json(table);
  })
);

restaurantTableRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await restaurantTableService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.json(updated);
  })
);

restaurantTableRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await restaurantTableService.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'Restaurant table not found' });
      return;
    }
    res.status(204).send();
  })
);