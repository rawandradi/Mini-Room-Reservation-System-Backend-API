import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Routes
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import roomRoutes from './rooms/room.routes';
import bookingRoutes from './bookings/booking.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({ message });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
