import styles from "./links.module.css";
import { renderAuthPage } from "./auth.ts";
import { renderRegisterPage } from "./register.ts";
import { renderChatPage } from "./chat.ts";
import { render404ErrorPage } from "./404.ts";
import { render505ErrorPage } from "./505.ts";
import { renderSettings } from "./settings.ts";

export function renderLinksPage() {
  const app = document.getElementById("app");
  if (!app) return;

  // Очищаем содержимое контейнера
  app.textContent = "";

  // Создаем контейнер для страницы
  const container = document.createElement("div");
  container.className = `container ${styles["container--links"]}`;

  renderSettings();

  // Вставляем HTML вручную
  // container.innerHTML = `
  //   <h1 class=${styles.links__title}>Доступные страницы</h1>
  //   <ul class="${styles["links-list"]}">
  //     <li><a href="#" data-page="auth">Авторизация</a></li>
  //     <li><a href="#" data-page="register">Регистрация</a></li>
  //     <li><a href="#" data-page="chat">Чат</a></li>
  //     <li><a href="#" data-page="404">404</a></li>
  //     <li><a href="#" data-page="505">505</a></li>
  //     <li><a href="#" data-page="settings">settings</a></li>
  //   </ul>
  // `;

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
        case "settings":
          renderSettings();
          break;
        default:
          console.error("Неизвестная страница");
      }
    });
  });
}
