import Handlebars from "handlebars";
import errorTemplate from "../templates/error.hbs?raw";
import styles from "../styles/pages/error.module.css";
import { renderLinksPage } from "./links.ts";

export function render505ErrorPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const template = Handlebars.compile(errorTemplate);

  app.innerHTML = template({
    errorName: "505",
    errorText: "Мы уже фиксим",
    linkText: "Назад к чатам",
    styles,
  });

  document.getElementById("error-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderLinksPage();
  });
}
