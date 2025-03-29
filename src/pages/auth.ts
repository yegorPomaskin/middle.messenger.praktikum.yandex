import Block from "../framework/block";
import { AuthRegisterForm, AuthField } from "../components/authRegisterForm/authRegisterForm";
import { RegisterPage } from "./register";

const fields: AuthField[] = [
    { label: "Логин", name: "login", type: "text", required: true },
    { label: "Пароль", name: "password", type: "password", required: true },
];

const AUTH_FORM_CONFIG = {
    title: "Вход",
    fields,
    buttonText: "Авторизоваться",
    linkText: "Нет аккаунта?",
    linkHref: "#register",
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
                onSubmit: (e: Event) => {
                    e.preventDefault();
                    // Логика отправки формы авторизации
                }
            }),
        });
    }

    protected render(): string {
        return `
                {{{ AuthForm }}}
        `;
    }
}
