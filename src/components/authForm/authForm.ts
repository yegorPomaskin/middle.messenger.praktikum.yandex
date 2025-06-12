import Block, { BlockProps } from '../../framework/block';
import { LOGIN_VALIDATION, PASSWORD_VALIDATION } from '../../utils/validationRules';
import { ValidationRule } from '../../utils/validator';
import { Button } from '../button/button';
import { FormField } from '../formField/formField';
import { Link } from '../link/link';

import template from './authForm.hbs?raw';
import styles from './authForm.module.css';

export interface AuthField {
  label: string;
  name: string;
  type: string;
  required: boolean;
}

export interface AuthFormProps extends BlockProps {
  title: string;
  fields: AuthField[];
  formFields?: FormField[];
  buttonText: string;
  linkText: string;
  onLinkClick: (event: Event) => void;
  onSubmit: (formData: Record<string, string>) => void;
  link?: Link;
  button?: Button;
}

export class AuthForm extends Block<AuthFormProps> {
  private _onSubmitCallback: ((formData: Record<string, string>) => void) | undefined;

  constructor(props: AuthFormProps) {
    const formFields = props.fields.map((field) => {
      let validationRules: ValidationRule[] = [];

      switch (field.name) {
        case 'login':
          validationRules = LOGIN_VALIDATION;
          break;
        case 'password':
          validationRules = PASSWORD_VALIDATION;
          break;
      }

      return new FormField({
        ...field,
        validationRules,
      });
    });

    const link = new Link({
      text: props.linkText,
      className: styles.form__link,
      events: {
        click: props.onLinkClick,
      },
    });

    const button = new Button({
      text: props.buttonText,
      type: 'submit',
      variant: 'login',
      className: styles.button,
    });

    const onSubmit = props.onSubmit;

    super({
      title: props.title,
      fields: props.fields,
      buttonText: props.buttonText,
      linkText: props.linkText,
      styles,
      formFields,
      link,
      button,
      onLinkClick: props.onLinkClick,
      onSubmit: props.onSubmit,
      events: {
        submit: (e: Event) => this._handleSubmit(e),
      },
    });

    // Инициализируем сохраненные колбэки после вызова super
    this._onSubmitCallback = onSubmit;
  }

  private _handleSubmit(e: Event): void {
    e.preventDefault();

    // Валидируем все поля и собираем данные формы
    let isFormValid = true;
    const formData: Record<string, string> = {};

    if (this.lists?.formFields) {
      this.lists.formFields.forEach((field) => {
        if (field instanceof FormField) {
          const isFieldValid = field.validate();
          isFormValid = isFormValid && isFieldValid;
          formData[field.getName()] = field.getValue();
        }
      });
    }

    // Используем сохраненный колбэк вместо this.props.onSubmit
    if (isFormValid && this._onSubmitCallback) {
      console.log('Данные формы:', formData);
      this._onSubmitCallback(formData);
    } else {
      console.log('Форма содержит ошибки');
    }
  }

  protected render(): string {
    return template;
  }
}
