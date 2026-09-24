import { NextFunction, Request, Response, Router } from "express";
import { validateDto } from "../../common/middlewares/validate";
import { authMiddleware } from "../auth/middleware/auth.middleware";
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderItemsDto
} from "./dto/order.dto";
import { orderService } from "./order.service";

export const orderRouter = Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };

orderRouter.get(
  "/",
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    res.json(await orderService.listByRestaurant(req.user!.id));
  }),
);

orderRouter.get(
  "/:id",
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.findByIdScoped(
      req.params.id,
      req.user!.id,
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(order);
  }),
);

orderRouter.post(
  "/",
  authMiddleware(),
  validateDto(CreateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    req.body.restaurantRef = req.user!.id;
    const order = await orderService.create(req.body);
    res.status(201).json(order);
  }),
);

orderRouter.put(
  "/:id",
  authMiddleware(),
  validateDto(UpdateOrderDto),
  asyncHandler(async (req: Request, res: Response) => {
    const updated = await orderService.updateScoped(
      req.params.id,
      req.user!.id,
      req.body,
    );
    if (!updated) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.json(updated);
  }),
);

orderRouter.put(
  "/remove-items/:id",
  authMiddleware(),
  validateDto(UpdateOrderItemsDto),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateOrderItemsDto;
    const id = req.params.id as string;
    const updated = await orderService.removeOrderItem(id, body);
    res.json(updated);
  }),
);

orderRouter.put(
  "/add-items/:id",
  authMiddleware(),
  validateDto(UpdateOrderItemsDto),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as UpdateOrderItemsDto;
    const id = req.params.id as string;
    const updated = await orderService.addOrderItem(id, body);
    res.json(updated);
  }),
);

orderRouter.delete(
  "/:id",
  authMiddleware(),
  asyncHandler(async (req: Request, res: Response) => {
    const removed = await orderService.removeScoped(
      req.params.id,
      req.user!.id,
    );
    if (!removed) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(204).send();
  }),
);
