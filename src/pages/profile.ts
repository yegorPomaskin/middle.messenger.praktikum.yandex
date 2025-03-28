import Block from "../framework/block";
import { ProfilePage } from "../components/profile/profilePage";
import { renderLinksPage } from "../pages/links";

export class ProfilePageHandler extends Block {
    constructor() {
        super({
            profilePage: new ProfilePage({
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
                        className: "action-link",
                        text: "Изменить данные",
                        onClick: () => console.log('Переход на страницу изменения данных'),
                    },
                    {
                        href: "#",
                        className: "action-link",
                        text: "Изменить пароль",
                        onClick: () => console.log('Переход на страницу изменения пароля'),
                    },
                    {
                        href: "#",
                        className: "logout-link",
                        text: "Выйти",
                        onClick: () => console.log('Выход из профиля'),
                    },
                ],
                sidebarData: {
                    href: "#",
                    iconSrc: "/back-arrow.png",
                    onClick: () => renderLinksPage(),
                },
            })
        });
    }

    protected render(): string {
        return `
            {{{ profilePage }}}
        `;
    }
}
