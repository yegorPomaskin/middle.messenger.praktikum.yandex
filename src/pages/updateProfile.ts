import Handlebars from "handlebars";
import settingTemplate from "../templates/updateProfile.hbs?raw";
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

const updatePasswordData = {
  profileImage: "/profile-pic.png",
  userFields: [
    { name: "email", label: "Почта", value: "test@mail.com" },
    { name: "login", label: "Логин", value: "ivanivanov" },
    { name: "first_name", label: "Имя", value: "Идрак" },
    { name: "second_name", label: "Фамилия", value: "Иванов" },
    { name: "display_name", label: "Имя в чате", value: "Иван" },
    { name: "phone", label: "Телефон", value: "+7 (909) 967 30 30" },
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
};

export function renderUpdateProfile() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = template(updatePasswordData);
}
