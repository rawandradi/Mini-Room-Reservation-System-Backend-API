import prisma from '../shared/prisma';
import { SafeUser } from './user.types';

export class UserRepo {
  static async findById(id: number): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user as SafeUser | null;
  }
}
