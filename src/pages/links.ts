// Страница загулшка с ссылками пока нет роутинга
import styles from "../styles/pages/links.module.css";
import { renderChatPage } from "./chat.ts";
// import { renderProfile } from "./profile.ts";
// import { renderUpdateProfile } from "./updateProfile.ts";
import { renderUpdatePassword } from "./updatePassword.ts";
import { renderUpdateAvatar } from "./updateAvatar.ts";

// Новые компоненты
import { Error404Page } from "./Error404.ts";
import { Error505Page } from "./Error505.ts";
import { AuthPage } from "./auth.ts";
import { RegisterPage } from "./register.ts";
import { ProfilePageHandler } from "./profile.ts";
import { UpdateProfilePageHandler } from "./updateProfile.ts";

const authPage = new AuthPage();
const registerPage = new RegisterPage();

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
          if (app) {
            app.innerHTML = "";
            app.appendChild(authPage.getContent()!);
            authPage.dispatchComponentDidMount();
          }
          break;
        case "register":
          if (app) {
            app.innerHTML = "";
            app.appendChild(registerPage.getContent()!);
            registerPage.dispatchComponentDidMount();
          }
          break;
        case "chat":
          renderChatPage();
          break;
        case "404":
          const new404Page = new Error404Page();
          document.getElementById("app")!.innerHTML = '';
          document.getElementById("app")!.appendChild(new404Page.getContent());
          break;
        case "505":
          const new505Page = new Error505Page();
          document.getElementById("app")!.innerHTML = '';
          document.getElementById("app")!.appendChild(new505Page.getContent());
          break;
        case "profile":
          const profilePage = new ProfilePageHandler();
          document.getElementById("app")!.innerHTML = '';
          document.getElementById("app")!.appendChild(profilePage.getContent());
          break;
        case "updateProfile":
          const updateProfilePage = new UpdateProfilePageHandler();
          document.getElementById("app")!.innerHTML = '';
          document.getElementById("app")!.appendChild(updateProfilePage.getContent());
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
