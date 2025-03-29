import Block from "../../framework/block";
import template from "./authRegisterForm.hbs?raw";
import styles from "./authRegisterForm.module.css";
import { AuthInput } from "./AuthRegisterInput/authFormInput";
import { Link } from "../link/link";
import { Button } from "../button/button";

export interface AuthField {
    label: string;
    name: string;
    type: string;
    required: boolean;
}

export interface AuthRegisterFormProps {
    title: string;
    fields: AuthField[];
    buttonText: string;
    linkText: string;
    isLogin: boolean;
    onLinkClick: (event: Event) => void;
    onSubmit: (event: Event) => void;
}

export class AuthRegisterForm extends Block {
    constructor(props: AuthRegisterFormProps) {
        const isLogin = props.isLogin;
        const modifier = isLogin ? styles.auth : styles.register;
        
        // Генерируем HTML для полей формы (Потому что handlebars дурачок)
        const fieldsHTML = props.fields.map(field =>
            new AuthInput({
                ...field,
            }).getContent().outerHTML
        ).join('');

        super({
            ...props,
            styles, 
            fieldsHTML,
            link: new Link({
                text: props.linkText,
                className: styles.form__link,
                events: {
                    click: props.onLinkClick,
                }
            }),
            button: new Button({  
                text: props.buttonText,
                type: "submit",
                className: `${styles.button} ${modifier}`,
            }),
            sectionModifier: modifier,
            buttonClass: `${styles.button} ${props.isLogin ? styles.button_login : styles.button_register}`,
            events: {
                submit: props.onSubmit,  // Обработчик формы
            }
        });
    }

    protected render(): string {
        return template;
    }
}