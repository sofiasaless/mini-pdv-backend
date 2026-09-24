import { Router, Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';
import { validateDto } from '../../common/middlewares/validate';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { authMiddleware } from '../auth/middleware/auth.middleware';

export const orderRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

orderRouter.get(
  '/',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await orderService.listByRestaurant(req.user!.id));
  })
);

orderRouter.get(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.findByIdScoped(req.params.id, req.user!.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  })
);

orderRouter.post(
  '/',
  authMiddleware(),
  validateDto(CreateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    req.body.restaurantRef = req.user!.id;
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  })
);

orderRouter.put(
  '/:id',
  authMiddleware(),
  validateDto(UpdateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await orderService.updateScoped(
      req.params.id,
      req.user!.id,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(updated);
  })
);

orderRouter.delete(
  '/:id',
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await orderService.removeScoped(req.params.id, req.user!.id);
    if (!removed) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(204).send();
  })
);
