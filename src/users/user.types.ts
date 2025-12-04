import { UserRole } from '@prisma/client';

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
