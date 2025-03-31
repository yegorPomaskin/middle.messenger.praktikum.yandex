// Страница загулшка с ссылками пока нет роутинга
import styles from '../styles/pages/links.module.css';

// Новые компоненты
import { AuthPage } from './auth';
import { ChatPage } from './chat';
import { Error404Page } from './Error404';
import { Error505Page } from './Error505';
import { ProfilePageHandler } from './profile';
import { RegisterPage } from './register';
import { UpdatePasswordPageHandler } from './updatePassword';
import { UpdateProfilePageHandler } from './updateProfile';

const authPage = new AuthPage();
const registerPage = new RegisterPage();
const newChatPage = new ChatPage({
  attachment: '/attachment.png',
  sendButton: '/send-button.png',
});
const new404Page = new Error404Page();
const new505Page = new Error505Page();
const profilePage = new ProfilePageHandler();
const updateProfilePage = new UpdateProfilePageHandler();
const updatePasswordPage = new UpdatePasswordPageHandler();

export function renderLinksPage() {
  const app = document.getElementById('app');
  if (!app) return;

  app.textContent = '';

  const container = document.createElement('div');
  container.className = `container ${styles['container--links']}`;

  container.innerHTML = `
    <h1 class=${styles.links__title}>Доступные страницы</h1>
    <nav class="links">
      <ul class="${styles['links-list']}">
        <li><a href="#" data-page="auth">Авторизация</a></li>
        <li><a href="#" data-page="register">Регистрация</a></li>
        <li><a href="#" data-page="chat">Чат</a></li>
        <li><a href="#" data-page="404">404</a></li>
        <li><a href="#" data-page="505">505</a></li>
        <li><a href="#" data-page="profile">Профиль</a></li>
        <li><a href="#" data-page="updateProfile">Изменить Профиль</a></li>
        <li><a href="#" data-page="updatePassword">Изменить Пароль</a></li>
      </ul>
    </nav>
  `;

  app.appendChild(container);

  const links = container.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const page = (event.target as HTMLElement).getAttribute('data-page');

      // В зависимости от страницы, рендерим нужный компонент
      switch (page) {
        case 'auth':
          if (app) {
            app.innerHTML = '';
            app.appendChild(authPage.getContent()!);
            authPage.dispatchComponentDidMount();
          }
          break;
        case 'register':
          if (app) {
            app.innerHTML = '';
            app.appendChild(registerPage.getContent()!);
            registerPage.dispatchComponentDidMount();
          }
          break;
        case 'chat':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(newChatPage.getContent());
          }
          break;
        case '404':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(new404Page.getContent());
          }
          break;
        case '505':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(new505Page.getContent());
          }
          break;
        case 'profile':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(profilePage.getContent());
          }
          break;
        case 'updateProfile':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(updateProfilePage.getContent());
          }
          break;
        case 'updatePassword':
          if (app) {
            document.getElementById('app')!.innerHTML = '';
            document.getElementById('app')!.appendChild(updatePasswordPage.getContent());
          }
          break;
        default:
          console.error('Неизвестная страница');
      }
    });
  });
}
