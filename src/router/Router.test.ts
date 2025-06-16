import { RouteGuard } from '../utils/routeGuard';

import Route from './Route';
import Router from './Router';

jest.mock('./Route', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((pathname) => {
      return {
        match: (path: string) => path === pathname,
        render: jest.fn(),
        leave: jest.fn(),
      };
    }),
  };
});

type MockRoute = {
  match: (path: string) => boolean;
};

type TestableRouter = {
  go(path: string): Promise<void>;
  back(): void;
  forward(): void;
  getRoute(path: string): MockRoute | undefined;
  use(path: string, component: new () => unknown): Router;
  _onRoute(path: string): void;
  routes: MockRoute[];
};

describe('Router', () => {
  let router: TestableRouter;

  beforeEach(() => {
    (Router as unknown as { __instance?: Router }).__instance = undefined;
    router = new Router('#app') as unknown as TestableRouter;
  });

  describe('use()', () => {
    test('добавляет новый Route', () => {
      class DummyBlock {}

      router.use('/test', DummyBlock);

      expect(router.routes).toHaveLength(1);
      expect(Route).toHaveBeenCalledWith('/test', DummyBlock, { rootQuery: '#app' });
    });
  });

  describe('go()', () => {
    test('вызывает pushState и _onRoute при успешной проверке доступа', async () => {
      const path = '/chat';

      // Создаю блок и регистрирую маршрут, чтобы избежать "Route not found"
      class DummyBlock {}

      router.use('/', DummyBlock as unknown as new () => unknown); 
      router.use(path, DummyBlock as unknown as new () => unknown);

      jest.spyOn(RouteGuard, 'beforeRouteChange').mockResolvedValue(true);
      const spyPushState = jest.spyOn(window.history, 'pushState');
      const spyOnRoute = jest.spyOn(router, '_onRoute');

      await router.go(path);

      expect(RouteGuard.beforeRouteChange).toHaveBeenCalledWith(path);
      expect(spyPushState).toHaveBeenCalledWith({}, '', path);
      expect(spyOnRoute).toHaveBeenCalledWith(path);
    });

    test('не переходит на закрытый маршрут', async () => {
      jest.spyOn(RouteGuard, 'beforeRouteChange').mockResolvedValueOnce(false);
      const pushSpy = jest.spyOn(window.history, 'pushState');
      const routeSpy = jest.spyOn(router, '_onRoute');

      await router.go('/private');

      expect(pushSpy).not.toHaveBeenCalledWith({}, '', '/private');
      expect(routeSpy).not.toHaveBeenCalledWith('/private');
    });
  });

  describe('getRoute()', () => {
    test('возвращает подходящий маршрут по pathname', () => {
      const mockRoute = { match: jest.fn((path) => path === '/chat') };
      router.routes = [mockRoute];

      const result = router.getRoute('/chat');

      expect(mockRoute.match).toHaveBeenCalledWith('/chat');
      expect(result).toBe(mockRoute);
    });

    test('возвращает undefined, если маршрут не найден', () => {
      const mockRoute = { match: jest.fn(() => false) };
      router.routes = [mockRoute];

      const result = router.getRoute('/unknown');

      expect(mockRoute.match).toHaveBeenCalledWith('/unknown');
      expect(result).toBeUndefined();
    });
  });

  describe('back()', () => {
    test('вызывает history.back()', () => {
      const spy = jest.spyOn(window.history, 'back');

      router.back();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('forward()', () => {
    test('вызывает history.forward()', () => {
      const spy = jest.spyOn(window.history, 'forward');

      router.forward();

      expect(spy).toHaveBeenCalled();
    });
  });
});
