import express, { Request, Response, NextFunction } from 'express';
import { authRouter } from './modules/auth/auth.controller';
import { restaurantRouter } from './modules/restaurant/restaurant.controller';
import { userRouter } from './modules/user/user.controller';
import { restaurantTableRouter } from './modules/restaurant-table/restaurant-table.controller';
import { menuItemRouter } from './modules/menu-item/menu-item.controller';
import { orderRouter } from './modules/order/order.controller';
import { HttpError } from './common/errors/http.error';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/restaurants', restaurantRouter);
app.use('/users', userRouter);
app.use('/restaurant-tables', restaurantTableRouter);
app.use('/menu-items', menuItemRouter);
app.use('/orders', orderRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});