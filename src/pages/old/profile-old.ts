import Handlebars from "handlebars";
import settingTemplate from "../templates/profile.hbs?raw";
import styles from "../styles/pages/profile.module.css";
// Подключаю partials
import profileFieldItem from "../partials/profileFieldItem.hbs?raw"; 
import actionLink from "../partials/actionLink.hbs?raw";
import sidebarPartial from "../partials/sidebar.hbs?raw";
import profileFieldItemStyles from "../styles/partials/commonProfileStyles.module.css"; 
import actionLinkStyles from "../styles/partials/actionLink.module.css";
import sidebarStyles from "../styles/partials/sidebar.module.css";

Handlebars.registerPartial("sidebar", sidebarPartial);
Handlebars.registerPartial("profileFieldItem", profileFieldItem);
Handlebars.registerPartial("actionLink", actionLink); //
const template = Handlebars.compile(settingTemplate);

const profileDate = {
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
    {
      href: "#",
      className: actionLinkStyles["action-link"],
      text: "Изменить данные",
    },
    {
      href: "#",
      className: actionLinkStyles["action-link"],
      text: "Изменить пароль",
    },
    { href: "#", className: actionLinkStyles["logout-link"], text: "Выйти" },
  ],
  sidebarData: {
    href: "#",
    iconSrc: "/back-arrow.png",
  },
  styles,
  profileFieldItemStyles,
  actionLinkStyles,
  sidebarStyles,
};

export function renderProfile() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = template(profileDate);
}
