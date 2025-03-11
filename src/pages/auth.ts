import formTemplate from "../templates/form.hbs?raw";
import Handlebars from "handlebars";
import styles from "./auth.module.css";
import { renderRegisterPage } from "./register.ts";
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../partials/button.module.css";

export function renderAuthPage() {
  const app = document.getElementById("app");
  if (!app) return;

  app.textContent = "";

  Handlebars.registerPartial("button", buttonPartial);
  const template = Handlebars.compile(formTemplate);

  // Проверка на какой странице кнопка - если на странице логина, то добавляем стили логина.
  const isLogin = true;
  const buttonClass = isLogin
    ? `${buttonStyles.button} ${buttonStyles["button--login"]}`
    : `${buttonStyles.button} ${buttonStyles["button--register"]}`;

  // У контейнера пока нет стиля, но пусть элемент будет 
  const container = document.createElement("div");
  container.className = `container ${styles["container--login"]}`;

  // Объект формы
  const formConfig = {
    title: "Вход",
    fields: [
      {
        label: "Логин",
        name: "login",
        type: "text",
        required: true,
      },
      {
        label: "Пароль",
        name: "password",
        type: "password",
        required: true,
      },
    ],
    buttonText: "Авторизоваться",
    buttonClass,
    linkText: "Нет аккаунта?",
    linkHref: "#register",
    styles,
  };

  // Рендерим форму
  container.innerHTML = template(formConfig);
  app.appendChild(container);

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderRegisterPage();
  });
}
