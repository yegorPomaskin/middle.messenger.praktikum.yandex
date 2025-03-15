import Handlebars from "handlebars";
import settingTemplate from "../templates/updatePassword.hbs?raw";
import styles from "../styles/pages/profile.module.css";
// Подключаю partials
import profileInput from "../partials/profileInput.hbs?raw";
import inputFieldStyles from "../styles/partials/commonProfileStyles.module.css";
import actionLink from "../partials/actionLink.hbs?raw";
import actionLinkStyles from "../styles/partials/actionLink.module.css";
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../styles/partials/button.module.css";
import sidebarPartial from "../partials/sidebar.hbs?raw";
import sidebarStyles from "../styles/partials/sidebar.module.css";

// Регистрирую partials
Handlebars.registerPartial("sidebar", sidebarPartial);
Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("profileInput", profileInput);
Handlebars.registerPartial("actionLink", actionLink);
const template = Handlebars.compile(settingTemplate);

// Нужные классы для кнопки
const buttonClass = `${buttonStyles.button} ${buttonStyles["button--save"]}`;

export function renderUpdatePassword() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = template({
    profileImage: "/profile-pic.png",
    userFields: [
      {
        name: "old_password",
        label: "Старый пароль",
        value: "12345678",
        type: "password",
      },
      {
        name: "new_password",
        label: "Новый пароль",
        value: "12345678910",
        type: "password",
      },
      {
        name: "confirm_password",
        label: "Повторите новый пароль",
        value: "12345678910",
        type: "password",
      },
    ],
    sidebarData: {
      href: "#",
      iconSrc: "/back-arrow.png",
    },
    buttonText: "Cохранить",
    styles,
    inputFieldStyles,
    actionLinkStyles,
    buttonStyles,
    buttonClass,
    sidebarStyles,
  });
}
