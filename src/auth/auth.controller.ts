import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const dto: RegisterDto = req.body;
      const user = await AuthService.register(dto);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const dto: LoginDto = req.body;
      const result = await AuthService.login(dto);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Login failed' });
    }
  }
}
