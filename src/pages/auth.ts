import { renderAuthRegisterForm } from "../components/authRegister/authRegisterForm";
import { renderRegisterPage } from "./register";

const AUTH_FORM_CONFIG = {
    title: "Вход",
    fields: [
        { label: "Логин", name: "login", type: "text", required: true },
        { label: "Пароль", name: "password", type: "password", required: true },
    ],
    buttonText: "Авторизоваться",
    linkText: "Нет аккаунта?",
    linkHref: "#register",
};

export function renderAuthPage() {
    renderAuthRegisterForm(AUTH_FORM_CONFIG, true, renderRegisterPage);
}
