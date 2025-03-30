/**
 * Компонент формы авторизации
 * Содержит поля ввода с простой валидацией, кнопку отправки и ссылку на регистрацию
 */
import Block from "../../framework/block";
import template from "./authForm.hbs?raw";
import styles from "./authForm.module.css";
import { FormField } from "../formField/formField";
import { Link } from "../link/link";
import { Button } from "../button/button";

export interface AuthField {
  label: string;
  name: string;
  type: string;
  required: boolean;
}

export interface AuthFormProps {
  title: string;
  fields: AuthField[];
  buttonText: string;
  linkText: string;
  onLinkClick: (event: Event) => void;
  onSubmit: (event: Event) => void;
}

export class AuthForm extends Block {
  constructor(props: AuthFormProps) {
    // Создаем компоненты для полей формы с базовой валидацией
    const fields = props.fields.map(
      (field) =>
        new FormField({
          ...field,
          validationRules: [
            {
              validator: (value: string) => value.trim() !== "",
              errorMessage: `Поле ${field.label.toLowerCase()} не может быть пустым`,
            },
          ],
        })
    );

    // Создаем компонент ссылки
    const link = new Link({
      text: props.linkText,
      className: styles.form__link,
      events: {
        click: props.onLinkClick,
      },
    });

    // Создаем компонент кнопки
    const button = new Button({
      text: props.buttonText,
      type: "submit",
      variant: "login",
      className: styles.button,
    });

    super({
      ...props,
      styles,
      fields,
      link,
      button,
      events: {
        submit: (e: Event) => this._handleSubmit(e),
      },
    });
  }

  /**
   * Обрабатывает отправку формы, валидирует поля и собирает данные
   */
  private _handleSubmit(e: Event): void {
    e.preventDefault();

    // Валидируем все поля и собираем данные формы
    let isFormValid = true;
    const formData: Record<string, string> = {};

    if (this.lists?.fields) {
      this.lists.fields.forEach((field) => {
        if (field instanceof FormField) {
          const isFieldValid = field.validate();
          isFormValid = isFormValid && isFieldValid;
          formData[field.getName()] = field.getValue();
        }
      });
    }

    if (isFormValid && this.props.onSubmit) {
      this.props.onSubmit(e);
    } else {
      console.log("Форма содержит ошибки");
    }
  }

  protected render(): string {
    return template;
  }
}