import AuthController from '../controllers/AuthController';
import { router } from '../router/Router';

export class RouteGuard {
  private static protectedRoutes = [
    '/messenger',
    '/settings',
    '/settings/edit-profile',
    '/settings/change-password',
  ];

  private static publicRoutes = ['/', '/register', '/404', '/505'];

  public static isProtectedRoute(pathname: string): boolean {
    return this.protectedRoutes.includes(pathname);
  }

  public static isPublicRoute(pathname: string): boolean {
    return this.publicRoutes.includes(pathname);
  }

  public static async checkAccess(pathname: string): Promise<boolean> {
    console.log('🛡️ Проверка доступа к:', pathname);

    const isProtected = this.isProtectedRoute(pathname);

    if (!isProtected) {
      console.log('✅ Публичный роут, доступ разрешен');
      return true;
    }

    console.log('🔒 Защищенный роут, проверяем авторизацию...');

    try {
      const user = await AuthController.fetchUser();

      if (user) {
        console.log('✅ Пользователь авторизован:', user.login);
        return true;
      } else {
        console.log('❌ Пользователь не авторизован');
        router.go('/');
        return false;
      }
    } catch (error) {
      console.log('❌ Ошибка проверки авторизации:', error);
      router.go('/');
      return false;
    }
  }

  public static async initGuard(): Promise<void> {
    const currentPath = window.location.pathname;
    await this.checkAccess(currentPath);
  }

  public static async beforeRouteChange(pathname: string): Promise<boolean> {
    return await this.checkAccess(pathname);
  }
}
