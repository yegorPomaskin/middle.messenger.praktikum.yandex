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
        
        // Создаем компоненты для полей формы
        const fields = props.fields.map(field =>
            new AuthInput({
                ...field,
            })
        );

        // Создаем компонент ссылки
        const link = new Link({
            text: props.linkText,
            className: styles.form__link,
            events: {
                click: props.onLinkClick,
            }
        });

        // Создаем компонент кнопки
        const button = new Button({  
            text: props.buttonText,
            type: "submit",
            className: `${styles.button} ${modifier}`,
        });

        super({
            ...props,
            styles, 
            fields,  // Передаем массив компонентов
            link,
            button,
            sectionModifier: modifier,
            buttonClass: `${styles.button} ${props.isLogin ? styles.button_login : styles.button_register}`,
            events: {
                submit: props.onSubmit,  // Обработчик формы
            }
        });
        
        // Отладочная информация
        console.log('Fields in lists:', this.lists.fields);
    }

    protected render(): string {
        return template;
    }
}