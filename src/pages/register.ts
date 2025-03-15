import formTemplate from "../templates/authRegisterForm.hbs?raw";
// Стили для register.ts и auth.ts в одном файле
import styles from "../styles/pages/auth.module.css";
import Handlebars from "handlebars";
import { renderAuthPage } from "./auth";
// Подключаю кнопку и ее стили как partial
import buttonPartial from "../partials/button.hbs?raw";
import buttonPartialStyles from "../styles/partials/button.module.css";
import authInputPartial from "../partials/authFormInput.hbs?raw";
import authInputPartialStyles from "../styles/partials/authInput.module.css";

// Регистрирую partial
Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("input", authInputPartial);

const template = Handlebars.compile(formTemplate);

const REGISTER_FORM_CONFIG = {
  title: "Регистрация",
  fields: [
    { label: "Почта", name: "email", type: "email", required: true },
    { label: "Логин", name: "login", type: "text", required: true },
    { label: "Имя", name: "first_name", type: "text", required: true },
    { label: "Фамилия", name: "last_name", type: "text", required: true },
    { label: "Телефон", name: "phone", type: "tel", required: true },
    { label: "Пароль", name: "password", type: "password", required: true },
    {
      label: "Пароль еще раз",
      name: "password_repeat",
      type: "password",
      required: true,
    },
  ],
  buttonText: "Зарегистрироваться",
  linkText: "Войти",
  linkHref: "#login",
};

export function renderRegisterPage() {
  const app = document.getElementById("app");
  if (!app) return;

  // Использую модификатор form--register для margin-top формы
  const formContainerModifier = styles["form__container--register"];

  // Проверка на какой странице кнопка - если не на странице логина, то добавляем стили register.
  const isLogin = false;
  const buttonClass = isLogin
    ? `${buttonPartialStyles.button} ${buttonPartialStyles["button--login"]}`
    : `${buttonPartialStyles.button} ${buttonPartialStyles["button--register"]}`;

  app.innerHTML = template({
    ...REGISTER_FORM_CONFIG,
    buttonClass,
    styles,
    authInputPartialStyles,
    formContainerModifier
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderAuthPage();
  });
}
