import { Response } from 'express';
import { AuthRequest } from '../shared/auth.middleware';
import { UserService } from './user.service';

export class UserController {
  static async me(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await UserService.getProfile(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  }
}
