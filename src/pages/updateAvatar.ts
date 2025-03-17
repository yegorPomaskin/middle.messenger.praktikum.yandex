import Handlebars from "handlebars";
import settingTemplate from "../templates/updateAvatar.hbs?raw";
import styles from "../styles/pages/profile.module.css";
// Подключаю partials
import profileFieldItem from "../partials/profileFieldItem.hbs?raw";
import actionLink from "../partials/actionLink.hbs?raw";
import sidebarPartial from "../partials/sidebar.hbs?raw";
import profileFieldItemStyles from "../styles/partials/commonProfileStyles.module.css";
import actionLinkStyles from "../styles/partials/actionLink.module.css";
import sidebarStyles from "../styles/partials/sidebar.module.css";
import buttonPartial from "../partials/button.hbs?raw";
import buttonStyles from "../styles/partials/button.module.css";

Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("sidebar", sidebarPartial);
Handlebars.registerPartial("profileFieldItem", profileFieldItem);
Handlebars.registerPartial("actionLink", actionLink); //
const template = Handlebars.compile(settingTemplate);

// Нужные классы для кнопки
const buttonClass = `${buttonStyles.button} ${buttonStyles["button--modal"]}`;

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
  buttonText: "Поменять",
  buttonStyles,
  buttonClass,
  styles,
  profileFieldItemStyles,
  actionLinkStyles,
  sidebarStyles,
};

export function renderUpdateAvatar() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = template(profileDate);

  bindAvatarModalEvents();
}

export function bindAvatarModalEvents(): void {
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");
  const modalOverlay = document.getElementById("modalOverlay") as HTMLElement;
  const modalWindow = document.getElementById("modalWindow") as HTMLElement;
  const closeModalBtn = document.getElementById("closeModalBtn") as HTMLElement;

  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", () => {
      modalOverlay.style.display = "block";
      modalWindow.style.display = "flex";
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modalOverlay.style.display = "none";
      modalWindow.style.display = "none";
    });
  }

  // Закрытие модального окна при клике на overlay
  modalOverlay.addEventListener("click", (event: MouseEvent) => {
    if (event.target === modalOverlay) {
      modalOverlay.style.display = "none";
      modalWindow.style.display = "none";
    }
  });
}
