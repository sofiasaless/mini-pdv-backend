import { Router, Request, Response, NextFunction } from 'express';
import { restaurantService } from './restaurant.service';

export const restaurantRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

restaurantRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json(await restaurantService.list());
  })
);

restaurantRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await restaurantService.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.json(restaurant);
  })
);

restaurantRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, address } = req.body;
    if (!name || !email || !address) {
      res.status(400).json({ message: 'Required fields: name, email, address' });
      return;
    }
    const restaurant = await restaurantService.create({ name, email, address });
    res.status(201).json(restaurant);
  })
);

restaurantRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await restaurantService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.json(updated);
  })
);

restaurantRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await restaurantService.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'Restaurant not found' });
      return;
    }
    res.status(204).send();
  })
);