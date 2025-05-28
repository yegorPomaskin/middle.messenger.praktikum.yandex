import './styles/global.css';
import AuthController from './controllers/AuthController';
import { AuthPage } from './pages/auth';
import { ChatPage } from './pages/chat';
import { Error404Page } from './pages/Error404';
import { Error505Page } from './pages/Error505';
import { ProfilePageHandler } from './pages/profile';
import { RegisterPage } from './pages/register';
import { UpdatePasswordPageHandler } from './pages/updatePassword';
import { UpdateProfilePageHandler } from './pages/updateProfile';
import { router } from './router/Router';

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
      router.go('/messenger'); 
    }
  } catch (error) {
    console.warn('🔒 Пользователь не авторизован:', error);
    await router.start(); // даже если ошибка — запускаем роутер
    router.go('/');
  }
}

document.addEventListener('DOMContentLoaded', initApp);

export { router };
