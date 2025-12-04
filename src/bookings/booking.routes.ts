import { Router } from 'express';
import { BookingController } from './booking.controller';
import { authMiddleware } from '../shared/auth.middleware';
import { allowRoles } from '../shared/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  authMiddleware,
  allowRoles(UserRole.GUEST),
  BookingController.create
);

router.get(
  '/guest/me',
  authMiddleware,
  allowRoles(UserRole.GUEST),
  BookingController.myBookingsForGuest
);

router.get(
  '/owner/my-rooms',
  authMiddleware,
  allowRoles(UserRole.OWNER),
  BookingController.bookingsForOwner
);

// للـ admin dashboard
router.get(
  '/admin',
  authMiddleware,
  allowRoles(UserRole.ADMIN),
  BookingController.allBookings
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  BookingController.cancel
);

export default router;
