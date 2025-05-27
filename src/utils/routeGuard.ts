import AuthController from '../controllers/AuthController';
import { router } from '../router/Router';

export class RouteGuard {
  // Защищенные роуты, требующие авторизации
  private static protectedRoutes = [
    '/messenger',
    '/settings',
    '/settings/edit-profile',
    '/settings/change-password'
  ];

  // Публичные роуты, доступные без авторизации
  private static publicRoutes = [
    '/',
    '/register',
    '/404',
    '/505'
  ];

  // Проверяет, требует ли роут авторизации
  public static isProtectedRoute(pathname: string): boolean {
    return this.protectedRoutes.includes(pathname);
  }

  // Проверяет, является ли роут публичным
  public static isPublicRoute(pathname: string): boolean {
    return this.publicRoutes.includes(pathname);
  }

  // Проверяет доступ к роуту
  public static async checkAccess(pathname: string): Promise<boolean> {
    console.log('🛡️ Проверка доступа к:', pathname);

    const isProtected = this.isProtectedRoute(pathname);
    
    if (!isProtected) {
      console.log('✅ Публичный роут, доступ разрешен');
      return true; // Публичные роуты всегда доступны
    }

    // Для защищенных роутов проверяем авторизацию
    console.log('🔒 Защищенный роут, проверяем авторизацию...');
    
    try {
      // Пытаемся получить данные пользователя с сервера
      const user = await AuthController.getCurrentUser();
      
      if (user) {
        console.log('✅ Пользователь авторизован:', user.login);
        return true;
      } else {
        console.log('❌ Пользователь не авторизован');
        router.go('/'); // Перенаправляем на страницу входа
        return false;
      }
    } catch (error) {
      console.log('❌ Ошибка проверки авторизации:', error);
      router.go('/'); // Перенаправляем на страницу входа
      return false;
    }
  }

  // Инициализирует защиту роутов
  public static async initGuard(): Promise<void> {
    console.log('🛡️ Инициализация защиты роутов...');
    
    // Проверяем текущий роут при загрузке приложения
    const currentPath = window.location.pathname;
    await this.checkAccess(currentPath);
  }

  // Проверка перед переходом на новый роут
  public static async beforeRouteChange(pathname: string): Promise<boolean> {
    return await this.checkAccess(pathname);
  }
}