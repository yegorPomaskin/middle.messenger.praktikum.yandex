// src/controllers/UserController.ts
import UserAPI, { UpdateUserData, UpdatePasswordData } from '../api/userAPI';
import AuthController from './AuthController';
import { router } from '../router/Router';

class UserController {
  // Обновление профиля пользователя
  async updateProfile(data: UpdateUserData): Promise<void> {
    try {
      console.log('🚀 Обновление профиля:', data);

      const updatedUser = await UserAPI.update(data);

      // Обновляем данные пользователя в AuthController
      AuthController.updateUserData(updatedUser);

      console.log('✅ Профиль обновлен:', updatedUser);

      // Возвращаемся к просмотру профиля
      router.go('/settings');
    } catch (error) {
      console.error('❌ Ошибка обновления профиля:', error);
      throw error;
    }
  }

  // Обновление пароля
  async updatePassword(data: UpdatePasswordData): Promise<void> {
    try {
      console.log('🚀 Обновление пароля');

      await UserAPI.updatePassword(data);

      console.log('✅ Пароль обновлен');

      // Возвращаемся к просмотру профиля
      router.go('/settings');
    } catch (error) {
      console.error('❌ Ошибка обновления пароля:', error);
      throw error;
    }
  }

  // Обновление аватара
  async updateAvatar(file: File): Promise<string> {
    try {
      console.log('🚀 Обновление аватара:', file.name);

      const updatedUser = await UserAPI.updateAvatar(file);

      // Обновляем данные пользователя в AuthController
      AuthController.updateUserData(updatedUser);

      console.log('✅ Аватар обновлен:', updatedUser);

      // Возвращаем URL нового аватара
      return updatedUser.avatar;
    } catch (error) {
      console.error('❌ Ошибка обновления аватара:', error);
      throw error;
    }
  }

  // Поиск пользователей
  async searchUsers(login: string): Promise<any[]> {
    try {
      console.log('🔍 Поиск пользователей:', login);

      const users = await UserAPI.searchUsers(login);

      console.log('✅ Найдено пользователей:', users.length);

      return users;
    } catch (error) {
      console.error('❌ Ошибка поиска пользователей:', error);
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр
export default new UserController();
