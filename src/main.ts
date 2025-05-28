import './styles/global.css';
import { router } from './router/Router';
import AuthController from './controllers/AuthController';

// Импортируем все страницы
import { AuthPage } from './pages/auth';
import { RegisterPage } from './pages/register';
import { ChatPage } from './pages/chat';
import { ProfilePageHandler } from './pages/profile';
import { UpdateProfilePageHandler } from './pages/updateProfile';
import { UpdatePasswordPageHandler } from './pages/updatePassword';
import { Error404Page } from './pages/Error404';
import { Error505Page } from './pages/Error505';

// Создаем класс-обертку для ChatPage с пропсами
class MessengerPage extends ChatPage {
  constructor() {
    super({
      attachment: '/attachment.png',
      sendButton: '/send-button.png',
    });
  }
}

// Инициализация приложения
async function initApp() {
  console.log('🚀 Инициализация приложения...');

  try {
    // Конфигурируем роуты заранее
    router
      .use('/', AuthPage)
      .use('/register', RegisterPage)
      .use('/messenger', MessengerPage)
      .use('/settings', ProfilePageHandler)
      .use('/settings/edit-profile', UpdateProfilePageHandler)
      .use('/settings/change-password', UpdatePasswordPageHandler)
      .use('/404', Error404Page)
      .use('/505', Error505Page);

    // Проверим авторизацию
    await AuthController.fetchUser(); // получим данные с /auth/user
    const user = AuthController.getUserData();

    await router.start();

    if (user) {
      router.go('/messenger'); // авторизован → в мессенджер
    }
  } catch (error) {
    console.warn('🔒 Пользователь не авторизован:', error);
    await router.start(); // даже если ошибка — запускаем роутер
    router.go('/');
  }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем роутер для использования в компонентах
export { router };
