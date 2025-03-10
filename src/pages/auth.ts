import formTemplate from "../templates/form.hbs?raw";
import Handlebars from "handlebars";
import { renderRegisterPage } from "./register.ts";

export function renderAuthPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const template = Handlebars.compile(formTemplate);

  app.innerHTML = template({
    title: "Вход",
    fields: [
      { label: "Логин", name: "login", type: "text", required: true },
      { label: "Пароль", name: "password", type: "password", required: true },
    ],
    buttonText: "Авторизоваться",
    linkText: "Нет аккаунта?",
    linkHref: "#register",
  });

  document.getElementById("form-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderRegisterPage();
  });
}
