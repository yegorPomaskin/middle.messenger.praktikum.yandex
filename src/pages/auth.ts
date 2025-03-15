import formTemplate from "../templates/form.hbs?raw";
import Handlebars from "handlebars";
// Стили для register и auth одинаковые
import styles from "../styles/pages/auth.module.css";
import { renderRegisterPage } from "./register.ts";
// Подключаю partials
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../partials/button.module.css";
import inputPartial from "../partials/input.hbs?raw";
import inputStyles from "../styles/partials/input.module.css";

// Регистрирую partials
Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("input", inputPartial);

const template = Handlebars.compile(formTemplate);

const AUTH_FORM_CONFIG = {
  title: "Вход",
  fields: [
    { label: "Логин", name: "login", type: "text", required: true },
    { label: "Пароль", name: "password", type: "password", required: true },
  ],
  buttonText: "Авторизоваться",
  linkText: "Нет аккаунта?",
  linkHref: "#register",
};

export function renderAuthPage() {
  const app = document.getElementById("app");
  if (!app) return;

  // У контейнера пока нет стиля, но пусть элемент будет
  const container = document.createElement("div");
  container.className = `container ${styles["container--login"]}`;

  // Проверка на какой странице кнопка - если на странице логина, то добавляем стили логина.
  const isLogin = true;
  const buttonClass = isLogin
    ? `${buttonStyles.button} ${buttonStyles["button--login"]}`
    : `${buttonStyles.button} ${buttonStyles["button--register"]}`;

  // Рендерим форму
  container.innerHTML = template({
    ...AUTH_FORM_CONFIG,
    buttonClass,
    styles,
    inputStyles,
  });

  app.textContent = "";
  app.appendChild(container);

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderRegisterPage();
  });
}
