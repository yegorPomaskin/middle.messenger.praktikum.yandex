import Handlebars from "handlebars";
import settingTemplate from "../templates/settings.hbs?raw";
import styles from "../styles/pages/settings.module.css";
// Подключаю partials
import inputFieldPartial from "../partials/profileFieldItem.hbs?raw";
import inputFieldStyles from "../styles/partials/profileFieldItem.module.css";
import actionButton from "../partials/actionButton.hbs?raw";
import actionButtonStyles from "../styles/partials/actionButton.module.css";

Handlebars.registerPartial("profileFieldItem", inputFieldPartial); // мб поменять название profileFieldItem
Handlebars.registerPartial("actionButton", actionButton); // мб поменять название profileFieldItem
const template = Handlebars.compile(settingTemplate);

export function renderProfile() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = template({
    profileImage: "/profile-pic.png",
    userName: "Иван",
    userFields: [
      { name: "email", label: "Почта", value: "test@mail.com" },
      { name: "login", label: "Логин", value: "ivanivanov" },
      { name: "first_name", label: "Имя", value: "Иван" },
      { name: "second_name", label: "Фамилия", value: "Иванов" },
      { name: "display_name", label: "Имя в чате", value: "Иван" },
      { name: "phone", label: "Телефон", value: "+7 (909) 967 30 30" },
    ],
    buttons: [
      { href: "#", className: "btn-update-data", text: "Изменить данные" },
      {
        href: "#",
        className: actionButtonStyles["action-btn"],  // проверь 
        text: "Изменить пароль",
      },
      { href: "#", className: actionButtonStyles["logout-btn"], text: "Выйти" },
    ],
    styles,
    inputFieldStyles,
    actionButtonStyles,
  });
}
