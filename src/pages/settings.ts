import Handlebars from "handlebars";
import settingTemplate from "../templates/settings.hbs?raw";
import styles from "./settings.module.css";

export function renderSettings() {
  const app = document.getElementById("app");
  if (!app) return;

  const template = Handlebars.compile(settingTemplate);
  app.innerHTML = template({
    profileImage: "/test-image.jpg",
    userName: "Иван",
    userFields: [
      { name: "email", label: "Почта", value: "test@mail.com" },
      { name: "login", label: "Логин", value: "ivanivanov" },
      { name: "first_name", label: "Имя", value: "Иван" },
      { name: "second_name", label: "Фамилия", value: "Иванов" },
      { name: "display_name", label: "Имя в чате", value: "Иван" },
      { name: "phone", label: "Телефон", value: "+7 (909) 967 30 30" },
    ],
    styles,
  });
}
