import Block, { BlockProps } from '../../framework/block';
import {
  LOGIN_VALIDATION,
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  PHONE_VALIDATION,
  NAME_VALIDATION,
} from '../../utils/validationRules';
import { ValidationRule } from '../../utils/validator';
import { Button } from '../button/button';
import { FormField } from '../formField/formField';
import { Link } from '../link/link';

import template from './registerForm.hbs?raw';
import styles from './registerForm.module.css';

export interface AuthField {
  label: string;
  name: string;
  type: string;
  required: boolean;
}

export interface RegisterFormProps extends BlockProps {
  [key: string]: unknown;
  title: string;
  fields: AuthField[];
  formFields?: FormField[];
  buttonText: string;
  linkText: string;
  isLogin: boolean;
  onLinkClick: (event: Event) => void;
  onSubmit: (formData: Record<string, string>) => void;
}

export class RegisterForm extends Block<RegisterFormProps> {
  private _onSubmitCallback: ((formData: Record<string, string>) => void) | undefined;

  constructor(props: RegisterFormProps) {
    const isLogin = props.isLogin;
    const modifier = isLogin ? styles.auth : styles.register;

    // Добавим правила валидации для полей
    const formFields = props.fields.map((field) => {
      // Явно указываем тип для validationRules
      let validationRules: ValidationRule[] = [];

      // Определяем правила валидации на основе имени поля
      switch (field.name) {
        case 'login':
          validationRules = LOGIN_VALIDATION;
          break;
        case 'password':
        case 'newPassword':
        case 'passwordConfirm':
          validationRules = PASSWORD_VALIDATION;
          break;
        case 'email':
          validationRules = EMAIL_VALIDATION;
          break;
        case 'phone':
          validationRules = PHONE_VALIDATION;
          break;
        case 'first_name':
        case 'second_name':
        case 'display_name':
          validationRules = NAME_VALIDATION;
          break;
      }

      return new FormField({
        ...field,
        validationRules,
      });
    });

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
      type: 'submit',
      className: `${styles.button} ${modifier}`,
    });

    // Сохраняем колбэки до вызова суперкласса
    // Это позволит нам использовать их позже
    const onSubmit = props.onSubmit;

    super({
      ...props,
      styles,
      formFields,
      link,
      button,
      sectionModifier: modifier,
      buttonClass: `${styles.button} ${
        props.isLogin ? styles.button_login : styles.button_register
      }`,
      events: {
        submit: (e: Event) => this.handleSubmit(e),
      },
    });

    // Инициализируем сохраненные колбэки после вызова super
    this._onSubmitCallback = onSubmit;
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    // Валидируем все поля при отправке формы
    let isFormValid = true;
    const formData: Record<string, string> = {};

    if (this.lists && this.lists.formFields) {
      this.lists.formFields.forEach((field) => {
        if (field instanceof FormField) {
          const isFieldValid = field.validate();
          isFormValid = isFormValid && isFieldValid;
          formData[field.getName()] = field.getValue();
        }
      });
    }

    // Если форма валидна, передаем данные обработчику
    if (isFormValid && this._onSubmitCallback) {
      console.log('Form data:', formData);
      this._onSubmitCallback(formData);
    } else {
      console.log('Form validation failed');
    }
  }

  protected render(): string {
    return template;
  }
}
