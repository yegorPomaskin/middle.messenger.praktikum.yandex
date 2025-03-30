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

         // Модифицируем обработчик onSubmit
         const handleSubmit = (event: Event) => {
            event.preventDefault();
            
            const formData: Record<string, string> = {};
            
            // Собираем данные из всех полей формы
            props.fields.forEach(field => {
                const input = this.element?.querySelector(`[name="${field.name}"]`) as HTMLInputElement;
                if (input) {
                    formData[field.name] = input.value;
                }
            });
            
            // Выводим собранные данные в консоль
            console.log('Form data:', formData);
            
            // Вызываем оригинальный обработчик, если он был передан
            if (props.onSubmit) {
                props.onSubmit(event);
            }
        };

        super({
            ...props,
            styles, 
            fields,  // Передаем массив компонентов
            link,
            button,
            sectionModifier: modifier,
            buttonClass: `${styles.button} ${props.isLogin ? styles.button_login : styles.button_register}`,
            events: {
                submit: handleSubmit,  // Используем наш обработчик
            }
        });
        
        
    }

    protected render(): string {
        return template;
    }
}