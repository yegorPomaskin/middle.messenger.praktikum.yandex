import Route from './Route';
import Block, { BlockProps } from '../framework/block';
import { RouteGuard } from '../utils/routeGuard';

export default class Router {
  private static __instance: Router;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery!: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: new () => Block<BlockProps>): Router {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  async start(): Promise<void> {
    // Инициализируем защиту роутов
    await RouteGuard.initGuard();

    window.onpopstate = async (event: PopStateEvent) => {
      const pathname = (event.currentTarget as Window).location.pathname;
      
      // Проверяем доступ перед переходом
      const hasAccess = await RouteGuard.beforeRouteChange(pathname);
      if (hasAccess) {
        this._onRoute(pathname);
      }
    };

    // Проверяем текущий путь только если у нас есть доступ
    const currentPath = window.location.pathname;
    const hasAccess = await RouteGuard.checkAccess(currentPath);
    if (hasAccess) {
      this._onRoute(currentPath);
    }
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      console.error(`Route not found for path: ${pathname}`);
      // Перенаправляем на главную страницу если роут не найден
      if (pathname !== '/') {
        this.go('/');
      }
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  async go(pathname: string): Promise<void> {
    // Проверяем доступ перед переходом
    const hasAccess = await RouteGuard.beforeRouteChange(pathname);
    
    if (hasAccess) {
      this.history.pushState({}, '', pathname);
      this._onRoute(pathname);
    }
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname));
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }
}

// Создаем singleton инстанс роутера
export const router = new Router('#app');