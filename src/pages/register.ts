import formTemplate from "../templates/form.hbs?raw";
// Стили для register.ts и auth.ts в одном файле
import styles from "../styles/pages/auth.module.css";
import Handlebars from "handlebars";
import { renderAuthPage } from "./auth";
// Подключаю кнопку и ее стили как partial
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../partials/button.module.css";
import inputPartial from "../partials/input.hbs?raw";
import inputStyles from "../styles/partials/input.module.css";

// Регистрирую partial
Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("input", inputPartial);

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

  const container = document.createElement("div");
  container.className = `container ${styles["container--register"]}`;

  // Проверка на какой странице кнопка - если не на странице логина, то добавляем стили register.
  const isLogin = false;
  const buttonClass = isLogin
    ? `${buttonStyles.button} ${buttonStyles["button--login"]}`
    : `${buttonStyles.button} ${buttonStyles["button--register"]}`;

  container.innerHTML = template({
    ...REGISTER_FORM_CONFIG,
    buttonClass,
    styles,
    inputStyles,
  });

  app.textContent = "";
  app.appendChild(container);

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderAuthPage();
  });
}
