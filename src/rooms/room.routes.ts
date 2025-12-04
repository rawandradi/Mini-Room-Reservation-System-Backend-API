import { Router } from 'express';
import { RoomController } from './room.controller';
import { authMiddleware } from '../shared/auth.middleware';
import { allowRoles } from '../shared/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  authMiddleware,
  allowRoles(UserRole.OWNER),
  RoomController.create
);

router.put(
  '/:id',
  authMiddleware,
  allowRoles(UserRole.OWNER),
  RoomController.update
);

router.get(
  '/me',
  authMiddleware,
  allowRoles(UserRole.OWNER),
  RoomController.myRooms
);

router.get(
  '/',
  authMiddleware,
  RoomController.available
);

export default router;
