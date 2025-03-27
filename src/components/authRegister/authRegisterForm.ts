import Handlebars from "handlebars";
import formTemplate from "./authRegisterForm.hbs?raw";

import styles from "./authRegister.module.css";
import buttonPartial from "../../partials/button.hbs?raw";
import authInputPartial from "../../partials/authFormInput.hbs?raw";
import buttonPartialStyles from "../../styles/partials/button.module.css";
import authInputPartialStyles from "../../styles/partials/authInput.module.css";

Handlebars.registerPartial("button", buttonPartial);
Handlebars.registerPartial("input", authInputPartial);

const template = Handlebars.compile(formTemplate);

interface Field {
    label: string;
    name: string;
    type: string;
    required: boolean;
}

interface FormConfig {
    title: string;
    fields: Field[];
    buttonText: string;
    linkText: string;
    linkHref: string;
}

export function renderAuthRegisterForm(config: FormConfig, isLogin: boolean, onLinkClick: () => void) {
    const app = document.getElementById("app");
    if (!app) return;

    const sectionModifier = isLogin ? styles["auth"] : styles["register"];
    const buttonClass = isLogin
        ? `${buttonPartialStyles.button} ${buttonPartialStyles["button--login"]}`
        : `${buttonPartialStyles.button} ${buttonPartialStyles["button--register"]}`;

    app.innerHTML = template({
        ...config,
        buttonClass,
        styles,
        authInputPartialStyles,
        sectionModifier
    });

    document.getElementById("form-link")?.addEventListener("click", (event) => {
        event.preventDefault();
        onLinkClick();
    });
}
