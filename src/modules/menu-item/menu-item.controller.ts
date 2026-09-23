import { Router, Request, Response, NextFunction } from 'express';
import { menuItemService } from './menu-item.service';

export const menuItemRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

menuItemRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json(await menuItemService.list());
  })
);

menuItemRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const item = await menuItemService.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(item);
  })
);

menuItemRouter.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, price } = req.body;
    if (!title || typeof price !== 'number') {
      res.status(400).json({ message: 'Required fields: title, price (number)' });
      return;
    }
    const item = await menuItemService.create({ title, price });
    res.status(201).json(item);
  })
);

menuItemRouter.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await menuItemService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.json(updated);
  })
);

menuItemRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await menuItemService.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'Menu item not found' });
      return;
    }
    res.status(204).send();
  })
);