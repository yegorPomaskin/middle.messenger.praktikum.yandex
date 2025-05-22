// src/main.ts - Главный файл с роутингом
import './styles/global.css';
import { router } from './router/Router';

// Импортируем все страницы
import { AuthPage } from './pages/auth';
import { RegisterPage } from './pages/register';
import { ChatPage } from './pages/chat';
import { ProfilePageHandler } from './pages/profile';
import { UpdateProfilePageHandler } from './pages/updateProfile';
import { UpdatePasswordPageHandler } from './pages/updatePassword';
import { Error404Page } from './pages/Error404';

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
function initApp() {
  // Конфигурируем роуты
  router
    .use('/', AuthPage) // Главная страница - авторизация
    .use('/register', RegisterPage)
    .use('/messenger', MessengerPage)
    .use('/settings', ProfilePageHandler)
    .use('/settings/edit-profile', UpdateProfilePageHandler)
    .use('/settings/change-password', UpdatePasswordPageHandler)
    .use('/404', Error404Page)
    .start(); // Запускаем роутер
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем роутер для использования в компонентах
export { router };