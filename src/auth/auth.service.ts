import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../shared/prisma';
import { RegisterDto, LoginDto } from './auth.dto';
import { SafeUser } from '../users/user.types';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'default_secret';

export class AuthService {
  static async register(dto: RegisterDto): Promise<SafeUser> {
    const { name, email, password, role } = dto;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email already in use');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role ?? 'GUEST',
      },
    });

    const { password: _p, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  static async login(
    dto: LoginDto
  ): Promise<{ token: string; user: SafeUser }> {
    const { email, password } = dto;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    const { password: _p, ...safeUser } = user;
    return { token, user: safeUser as SafeUser };
  }
}
