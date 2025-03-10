import formTemplate from "../templates/form.hbs?raw";
import Handlebars from "handlebars";
import styles from "./auth.module.css";
import { renderRegisterPage } from "./register.ts";
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../partials/button.module.css";

export function renderAuthPage() {
  const app = document.getElementById("app");
  if (!app) return;

  Handlebars.registerPartial("button", buttonPartial);
  const template = Handlebars.compile(formTemplate);

  const isLogin = true; // or set it based on your logic
  const buttonClass = isLogin
    ? `${buttonStyles.button} ${buttonStyles["button--login"]}`
    : `${buttonStyles.button} ${buttonStyles["button--register"]}`;

  app.innerHTML = template({
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
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderRegisterPage();
  });
}
