// Страница загулшка с ссылками пока нет роутинга
import styles from "../styles/pages/links.module.css";
import { renderAuthPage } from "./auth.ts";
import { renderRegisterPage } from "./register.ts";
import { renderChatPage } from "./chat.ts";
import { render404ErrorPage } from "./404.ts";
import { render505ErrorPage } from "./505.ts";
import { renderProfile } from "./profile.ts";
import { renderUpdateProfile } from "./updateProfile.ts";
import { renderUpdatePassword } from "./updatePassword.ts";
import { renderUpdateAvatar } from "./updateAvatar.ts";

export function renderLinksPage() {
  const app = document.getElementById("app");
  if (!app) return;

  app.textContent = "";

  const container = document.createElement("div");
  container.className = `container ${styles["container--links"]}`;

  container.innerHTML = `
    <h1 class=${styles.links__title}>Доступные страницы</h1>
    <nav class="links">
      <ul class="${styles["links-list"]}">
        <li><a href="#" data-page="auth">Авторизация</a></li>
        <li><a href="#" data-page="register">Регистрация</a></li>
        <li><a href="#" data-page="chat">Чат</a></li>
        <li><a href="#" data-page="404">404</a></li>
        <li><a href="#" data-page="505">505</a></li>
        <li><a href="#" data-page="profile">Профиль</a></li>
        <li><a href="#" data-page="updateProfile">Изменить Профиль</a></li>
        <li><a href="#" data-page="updatePassword">Изменить Пароль</a></li>
        <li><a href="#" data-page="updateAvatar">Изменить Аватар</a></li>
      </ul>
    </nav>
  `;

  app.appendChild(container);

  const links = container.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const page = (event.target as HTMLElement).getAttribute("data-page");

      // В зависимости от страницы, рендерим нужный компонент
      switch (page) {
        case "auth":
          renderAuthPage();
          break;
        case "register":
          renderRegisterPage();
          break;
        case "chat":
          renderChatPage();
          break;
        case "404":
          render404ErrorPage();
          break;
        case "505":
          render505ErrorPage();
          break;
        case "profile":
          renderProfile();
          break;
        case "updateProfile":
          renderUpdateProfile();
          break;
        case "updatePassword":
          renderUpdatePassword();
          break;
        case "updateAvatar":
          renderUpdateAvatar();
          break;
        default:
          console.error("Неизвестная страница");
      }
    });
  });
}
