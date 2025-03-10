import formTemplate from "../templates/form.hbs?raw";
import Handlebars from "handlebars";
import { renderAuthPage } from "./auth";

export function renderRegisterPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const template = Handlebars.compile(formTemplate);

  app.innerHTML = template({
    title: "Регистрация",
    fields: [
      { label: "Почта", name: "email", type: "email", required: true },
      { label: "Логин", name: "login", type: "text", required: true },
      { label: "Имя", name: "first_name", type: "text", required: true },
      { label: "Фамилия", name: "last_name", type: "text", required: true },
      { label: "Телефон", name: "phone", type: "tel", required: true },
      { label: "Пароль", name: "password", type: "password", required: true },
    ],
    buttonText: "Зарегистрироваться",
    linkText: "Войти",
    linkHref: "#login",
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderAuthPage();
  });
}
