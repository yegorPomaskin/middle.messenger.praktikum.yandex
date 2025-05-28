import { ChatUser } from '../api/chatAPI';
import UserAPI, { UpdateUserData, UpdatePasswordData } from '../api/userAPI';
import { router } from '../router/Router';

import AuthController from './AuthController';

class UserController {
  async updateProfile(data: UpdateUserData): Promise<void> {
    const updatedUser = await UserAPI.update(data);
    AuthController.updateUserData(updatedUser);
    router.go('/settings');
  }

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await UserAPI.updatePassword(data);
    router.go('/settings');
  }

  async updateAvatar(file: File): Promise<string> {
    const updatedUser = await UserAPI.updateAvatar(file);
    AuthController.updateUserData(updatedUser);
    return updatedUser.avatar;
  }

  async searchUsers(login: string): Promise<ChatUser[]> {
    return UserAPI.searchUsers(login);
  }
}

export default new UserController();
