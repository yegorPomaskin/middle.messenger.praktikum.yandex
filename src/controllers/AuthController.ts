// src/controllers/AuthController.ts
import AuthAPI, { SignInData, SignUpData, UserData } from '../api/authAPI';
import { router } from '../router/Router';

class AuthController {
  private currentUser: UserData | null = null;

  // Регистрация нового пользователя
  async signUp(data: SignUpData): Promise<void> {
    try {
      console.log('🚀 Начинаем регистрацию:', data.login);
      
      // Вызываем API регистрации
      const user = await AuthAPI.create(data);
      this.currentUser = user;
      
      console.log('✅ Регистрация успешна:', user);
      
      // После успешной регистрации переходим сразу в чат
      router.go('/messenger');
      
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      // Пробрасываем ошибку дальше, чтобы UI мог её обработать
      throw error;
    }
  }

  // Авторизация пользователя
  async signIn(data: SignInData): Promise<void> {
    try {
      console.log('🚀 Начинаем авторизацию:', data.login);
      
      // Вызываем API авторизации
      await AuthAPI.signIn(data);
      
      // После успешной авторизации получаем данные пользователя
      const user = await AuthAPI.request();
      this.currentUser = user;
      
      console.log('✅ Авторизация успешна:', user);
      
      // Переходим в чат
      router.go('/messenger');
      
    } catch (error) {
      console.error('❌ Ошибка авторизации:', error);
      throw error;
    }
  }

  // Выход из системы
  async logout(): Promise<void> {
    try {
      console.log('🚀 Выходим из системы');
      
      await AuthAPI.logout();
      this.currentUser = null;
      
      console.log('✅ Выход выполнен');
      
      // Переходим на страницу авторизации
      router.go('/');
      
    } catch (error) {
      console.error('❌ Ошибка при выходе:', error);
      throw error;
    }
  }

  // Получение текущего пользователя
  async getCurrentUser(): Promise<UserData | null> {
    try {
      // Если пользователь уже загружен, возвращаем его
      if (this.currentUser) {
        return this.currentUser;
      }

      // Иначе пытаемся получить из API
      const user = await AuthAPI.request();
      this.currentUser = user;
      return user;
    } catch (error) {
      console.log('ℹ️ Пользователь не авторизован');
      this.currentUser = null;
      return null;
    }
  }

  // Проверка авторизации пользователя
  async checkAuth(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  // Получить данные текущего пользователя (синхронно, для использования в UI)
  getUserData(): UserData | null {
    console.log('🔍 getUserData вызван, currentUser:', this.currentUser);
    return this.currentUser;
  }

  // Обновить данные пользователя (после обновления профиля)
  updateUserData(userData: UserData): void {
    this.currentUser = userData;
    console.log('ℹ️ Данные пользователя обновлены:', userData);
  }
}

// Экспортируем единственный экземпляр
export default new AuthController();