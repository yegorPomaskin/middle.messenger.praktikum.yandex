import AuthAPI, { SignInData, SignUpData, UserData } from '../api/authAPI';
import { router } from '../router/Router';
import Store from '../store/store';

class AuthController {
  async signUp(data: SignUpData): Promise<void> {
    Store.setUserLoading(true);
    Store.clearUserError();
    
    try {
      const user = await AuthAPI.create(data);
      Store.setCurrentUser(user);
      router.go('/messenger');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      Store.setUserError(message);
      throw error;
    } finally {
      Store.setUserLoading(false);
    }
  }

  async signIn(data: SignInData): Promise<void> {
    Store.setUserLoading(true);
    Store.clearUserError();
    
    try {
      await AuthAPI.signIn(data);
      const user = await AuthAPI.request();
      Store.setCurrentUser(user);
      router.go('/messenger');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка авторизации';
      Store.setUserError(message);
      throw error;
    } finally {
      Store.setUserLoading(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    }

    Store.reset();
    router.go('/');
  }

  // 🔁 Было: getCurrentUser
  async fetchUser(): Promise<UserData | null> {
    const cached = Store.getCurrentUser();
    if (cached) return cached;

    try {
      Store.setUserLoading(true);
      const user = await AuthAPI.request();
      Store.setCurrentUser(user);
      return user;
    } catch (error) {
      Store.setCurrentUser(null);
      return null;
    } finally {
      Store.setUserLoading(false);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.fetchUser();
    return user !== null;
  }

  getUserData(): UserData | null {
    return Store.getCurrentUser();
  }

  updateUserData(userData: UserData): void {
    Store.setCurrentUser(userData);
  }
}

export default new AuthController();