import Handlebars from "handlebars";
import Block from "../../framework/block";
import template from "./authRegisterForm.hbs?raw";

import styles from "./authRegister.module.css";
import buttonPartial from "../../partials/button.hbs?raw";
import buttonPartialStyles from "../../styles/partials/button.module.css";

// Импортируем новый компонент
import { AuthInput, AuthInputProps } from "../authFormInput";

// Регистрируем partial'ы один раз
Handlebars.registerPartial("button", buttonPartial);

export interface Field {
    label: string;
    name: string;
    type: string;
    required: boolean;
}

export interface AuthRegisterFormProps {
    title: string;
    fields: Field[];
    buttonText: string;
    linkText: string;
    linkHref: string;
    isLogin: boolean;
    onLinkClick: () => void;
    authInputStyles: { [key: string]: string };
}

export class AuthRegisterForm extends Block {
    // Вместо хранения в свойстве – создаём геттер, который возвращает массив компонентов
    private get authInputComponents(): AuthInput[] {
        return this.props.fields.map((field: Field) =>
            new AuthInput({
                ...field,
                styles: this.props.authInputStyles,
            } as AuthInputProps)
        );
    }

    constructor(props: AuthRegisterFormProps) {
        super(props);
        if (!props.fields) {
            console.error("Поле fields не передано в AuthRegisterFormProps");
        }
    }

    override render(): string {
        // Вычисляем дополнительные переменные для шаблона
        const sectionModifier = this.props.isLogin ? styles["auth"] : styles["register"];
        const buttonClass = this.props.isLogin
            ? `${buttonPartialStyles.button} ${buttonPartialStyles["button--login"]}`
            : `${buttonPartialStyles.button} ${buttonPartialStyles["button--register"]}`;

        // Возвращаем скомпилированный шаблон с объединёнными данными
        const compiledTemplate = Handlebars.compile(template); // компилируем строку-шаблон в функцию
        return compiledTemplate({
            ...this.props,
            styles,
            sectionModifier,
            buttonClass,
        });
    }

    override componentDidMount(): void {
        // После того, как элемент будет вставлен в DOM, добавляем обработчик клика по ссылке
        const formLink = this.getContent()?.querySelector("#form-link");
        formLink?.addEventListener("click", (event: Event) => {
            event.preventDefault();
            this.props.onLinkClick();
        });
    }
}
