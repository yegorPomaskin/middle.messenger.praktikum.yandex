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
            const content = authPage.getContent();
            if (content) {
              app.appendChild(content);
              authPage.dispatchComponentDidMount();
            }
          }
          break;
        case 'register':
          if (app) {
            app.innerHTML = '';
            const content = registerPage.getContent();
            if (content) {
              app.appendChild(content);
              registerPage.dispatchComponentDidMount();
            }
          }
          break;
        case 'chat':
          if (app) {
            app.innerHTML = '';
            const content = newChatPage.getContent();
            if (content) {
              app.appendChild(content);
              newChatPage.dispatchComponentDidMount();
            }
          }
          break;
        case '404':
          if (app) {
            app.innerHTML = '';
            const content = new404Page.getContent();
            if (content) {
              app.appendChild(content);
              new404Page.dispatchComponentDidMount();
            }
          }
          break;
        case '505':
          if (app) {
            app.innerHTML = '';
            const content = new505Page.getContent();
            if (content) {
              app.appendChild(content);
              new505Page.dispatchComponentDidMount();
            }
          }
          break;
        case 'profile':
          if (app) {
            app.innerHTML = '';
            const content = profilePage.getContent();
            if (content) {
              app.appendChild(content);
              profilePage.dispatchComponentDidMount();
            }
          }
          break;
        case 'updateProfile':
          if (app) {
            app.innerHTML = '';
            const content = updateProfilePage.getContent();
            if (content) {
              app.appendChild(content);
              updateProfilePage.dispatchComponentDidMount();
            }
          }
          break;
        case 'updatePassword':
          if (app) {
            app.innerHTML = '';
            const content = updatePasswordPage.getContent();
            if (content) {
              app.appendChild(content);
              updatePasswordPage.dispatchComponentDidMount();
            }
          }
          break;
        default:
          console.error('Неизвестная страница');
      }
    });
  });
}
