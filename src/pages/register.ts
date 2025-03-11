import formTemplate from "../templates/form.hbs?raw";
import styles from "./auth.module.css";
import Handlebars from "handlebars";
import { renderAuthPage } from "./auth";
// Подключаю кнопку и ее стили как partial 
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../partials/button.module.css";

export function renderRegisterPage() {
  const app = document.getElementById("app");
  if (!app) return;

  Handlebars.registerPartial("button", buttonPartial);
  const template = Handlebars.compile(formTemplate);

  // Проверка на какой странице кнопка - если не на странице логина, то добавляем стили register.
  const isLogin = false;
  const buttonClass = isLogin
    ? `${buttonStyles.button} ${buttonStyles["button--login"]}`
    : `${buttonStyles.button} ${buttonStyles["button--register"]}`;

  const container = document.createElement("div");
  container.className = `container ${styles["container--register"]}`;

  container.insertAdjacentHTML(
    "beforeend",
    template({
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
          name: "password",
          type: "password",
          required: true,
        },
      ],
      buttonText: "Зарегистрироваться",
      buttonClass,
      linkText: "Войти",
      linkHref: "#login",
      styles,
    })
  );

  app.textContent = "";
  app.appendChild(container);

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderAuthPage();
  });
}
