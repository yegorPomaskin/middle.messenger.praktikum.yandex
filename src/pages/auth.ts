import Handlebars from "handlebars";
import formTemplate from "../templates/authRegisterForm.hbs?raw";
// Стили для register и auth одинаковые
import styles from "../styles/pages/authRegister.module.css";
import { renderRegisterPage } from "./register.ts";
// Подключаю partials
import buttonPartial from "../partials/button.hbs?raw";
import authInputPartial from "../partials/authFormInput.hbs?raw";
import buttonPartialStyles from "../styles/partials/button.module.css";
import authInputPartialStyles from "../styles/partials/authInput.module.css";

// Регистрирую partials
Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("input", authInputPartial);

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

    // Использую модификатор form--auth для margin-top формы
    const formContainerModifier = styles["form__container--auth"];

  // Проверка на какой странице кнопка - если на странице логина, то добавляем стили логина.
  const isLogin = true;
  const buttonClass = isLogin
    ? `${buttonPartialStyles.button} ${buttonPartialStyles["button--login"]}`
    : `${buttonPartialStyles.button} ${buttonPartialStyles["button--register"]}`;

  // Рендерим форму
  app.innerHTML = template({
    ...AUTH_FORM_CONFIG,
    buttonClass,
    styles,
    authInputPartialStyles,
    formContainerModifier
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderRegisterPage();
  });
}
