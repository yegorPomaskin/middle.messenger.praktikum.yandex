import AuthAPI, { SignInData, SignUpData, UserData } from '../api/authAPI';
import { router } from '../router/Router';
import Store from '../store/store';

class AuthController {
  // Регистрация нового пользователя
  async signUp(data: SignUpData): Promise<void> {
    try {
      console.log('🚀 Начинаем регистрацию:', data.login);
      
      Store.setUserLoading(true);
      Store.clearUserError();
      
      // Вызываем API регистрации
      const user = await AuthAPI.create(data);
      
      // Сохраняем данные в Store
      Store.setCurrentUser(user);
      
      console.log('✅ Регистрация успешна:', user);
      
      // После успешной регистрации переходим сразу в чат
      router.go('/messenger');
      
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
      Store.setUserError(errorMessage);
      
      throw error;
    } finally {
      Store.setUserLoading(false);
    }
  }

  // Авторизация пользователя
  async signIn(data: SignInData): Promise<void> {
    try {
      console.log('🚀 Начинаем авторизацию:', data.login);
      
      Store.setUserLoading(true);
      Store.clearUserError();
      
      // Вызываем API авторизации
      await AuthAPI.signIn(data);
      
      // После успешной авторизации получаем данные пользователя
      const user = await AuthAPI.request();
      
      // Сохраняем данные в Store
      Store.setCurrentUser(user);
      
      console.log('✅ Авторизация успешна:', user);
      
      // Переходим в чат
      router.go('/messenger');
      
    } catch (error) {
      console.error('❌ Ошибка авторизации:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка авторизации';
      Store.setUserError(errorMessage);
      
      throw error;
    } finally {
      Store.setUserLoading(false);
    }
  }

  // Выход из системы
  async logout(): Promise<void> {
    try {
      console.log('🚀 Выходим из системы');
      
      await AuthAPI.logout();
      
      // Очищаем Store полностью
      Store.reset();
      
      console.log('✅ Выход выполнен');
      
      // Переходим на страницу авторизации
      router.go('/');
      
    } catch (error) {
      console.error('❌ Ошибка при выходе:', error);
      
      // Даже при ошибке очищаем Store и перенаправляем
      Store.reset();
      router.go('/');
      
      throw error;
    }
  }

  // Получение текущего пользователя
  async getCurrentUser(): Promise<UserData | null> {
    try {
      // Если пользователь уже есть в Store, возвращаем его
      const currentUser = Store.getCurrentUser();
      if (currentUser) {
        return currentUser;
      }

      console.log('🔄 Загружаем данные пользователя с сервера...');
      Store.setUserLoading(true);
      
      // Иначе пытаемся получить из API
      const user = await AuthAPI.request();
      
      // Сохраняем в Store
      Store.setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.log('ℹ️ Пользователь не авторизован');
      
      Store.setCurrentUser(null);
      return null;
    } finally {
      Store.setUserLoading(false);
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

  // Получить данные текущего пользователя из Store (синхронно)
  getUserData(): UserData | null {
    return Store.getCurrentUser();
  }

  // Обновить данные пользователя (после обновления профиля)
  updateUserData(userData: UserData): void {
    Store.setCurrentUser(userData);
    console.log('ℹ️ Данные пользователя обновлены:', userData);
  }
}

// Экспортируем единственный экземпляр
export default new AuthController();