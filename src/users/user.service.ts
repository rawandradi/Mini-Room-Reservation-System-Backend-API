import { UserRepo } from './user.repo';
import { UserProfileResponseDto } from './user.dto';

export class UserService {
  static async getProfile(id: number): Promise<UserProfileResponseDto | null> {
    return UserRepo.findById(id);
  }
}
