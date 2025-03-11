import Handlebars from "handlebars";
import errorTemplate from "../templates/error.hbs?raw";
import styles from "./error.module.css";
import { renderLinksPage } from "./links.ts";

export function render404ErrorPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const template = Handlebars.compile(errorTemplate);

  app.innerHTML = template({
    errorName: "404",
    errorText: "Не туда попали",
    linkText: "Назад к чатам",
    styles,
  });

  document.getElementById("error-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    renderLinksPage();
  });
}
