import Handlebars from "handlebars";
import formTemplate from "../templates/authRegisterForm.hbs?raw";
// Стили для register.ts и auth.ts в одном файле
import styles from "../styles/pages/authRegister.module.css";
import { renderAuthPage } from "./auth";
// Подключаю partials
import buttonPartial from "../partials/button.hbs?raw";
import authInputPartial from "../partials/authFormInput.hbs?raw";
import authInputPartialStyles from "../styles/partials/authInput.module.css";
import buttonPartialStyles from "../styles/partials/button.module.css";

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

  // Использую модификатор section
  const sectionModifier = styles["register"];

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
    sectionModifier
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderAuthPage();
  });
}
