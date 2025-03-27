import Block from "../framework/block";
import { AuthRegisterForm } from "../components/authRegister/authRegisterForm";
import { RegisterPage } from "./register";
import { AuthInputProps } from "../components/authFormInput";

// Задаем реальные данные для полей, соответствующие интерфейсу AuthInputProps
const fields: AuthInputProps[] = [
    { label: "Логин", name: "login", type: "text", required: true },
    { label: "Пароль", name: "password", type: "password", required: true },
];

const authInputStyles: { [key: string]: string } = {
    form__label: "form__label", // замените на реальные имена классов, если нужно
    form__input: "form__input",
};

const AUTH_FORM_CONFIG = {
    title: "Вход",
    fields,
    buttonText: "Авторизоваться",
    linkText: "Нет аккаунта?",
    linkHref: "#register",
    authInputStyles,
};

export class AuthPage extends Block {
    constructor() {
        super({
            AuthForm: new AuthRegisterForm({
                ...AUTH_FORM_CONFIG,
                isLogin: true,
                onLinkClick: () => {
                    const registerPage = new RegisterPage();
                    const app = document.getElementById("app");
                    if (app) {
                        app.innerHTML = "";
                        app.appendChild(registerPage.getContent()!);
                        registerPage.dispatchComponentDidMount();
                    }
                },
            }),
        });
    }

    override render(): string {
        // Возвращаем шаблон, где плейсхолдер {{{ AuthForm }}} будет заменён методом _render базового класса
        return `
            <div class="app">
                {{{ AuthForm }}}
            </div>
        `;
    }
}
