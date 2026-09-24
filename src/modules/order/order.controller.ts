import { Router, Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';
import { validateDto } from '../../common/middlewares/validate';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

export const orderRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

orderRouter.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    res.json(await orderService.list());
  })
);

orderRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  })
);

orderRouter.post(
  '/',
  validateDto(CreateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  })
);

orderRouter.put(
  '/:id',
  validateDto(UpdateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await orderService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(updated);
  })
);

orderRouter.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await orderService.remove(req.params.id);
    if (!removed) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(204).send();
  })
);