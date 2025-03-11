import styles from "./links.module.css";
import { renderAuthPage } from "./auth.ts";
import { renderRegisterPage } from "./register.ts";
import { renderChatPage } from "./chat.ts";

export function renderLinksPage() {
  const app = document.getElementById("app");
  if (!app) return;

  // Очищаем содержимое контейнера
  app.textContent = "";

  // Создаем контейнер для страницы
  const container = document.createElement("div");
  container.className = `container ${styles["container--links"]}`;

  // Вставляем HTML вручную
  container.innerHTML = `
    <h1 class=${styles.links__title}>Доступные страницы</h1>
    <ul class="${styles["links-list"]}">
      <li><a href="#" data-page="auth">Авторизация</a></li>
      <li><a href="#" data-page="register">Регистрация</a></li>
      <li><a href="#" data-page="chat">Чат</a></li>
    </ul>
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
        default:
          console.error("Неизвестная страница");
      }
    });
  });
}
