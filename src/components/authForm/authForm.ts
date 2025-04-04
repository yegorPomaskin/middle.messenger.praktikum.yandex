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

// Расширяем BlockProps для типизации пропсов AuthForm
export interface AuthFormProps extends BlockProps {
  title: string;
  fields: AuthField[]; // Исходные поля для инициализации
  formFields?: FormField[]; // Поля после обработки (опциональные)
  buttonText: string;
  linkText: string;
  onLinkClick: (event: Event) => void;
  onSubmit: (event: Event) => void;
  link?: Link;
  button?: Button;
}

// Указываем дженерик-тип для Block
export class AuthForm extends Block<AuthFormProps> {
  // Сохраняем оригинальные колбэки как свойства класса
  private _onSubmitCallback: ((event: Event) => void) | undefined;

  constructor(props: AuthFormProps) {
    // Добавим правила валидации для полей
    const formFields = props.fields.map((field) => {
      //Явно указываем тип
      let validationRules: ValidationRule[] = [];

      // Определяем правила валидации на основе имени поля
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
      variant: 'login',
      className: styles.button,
    });

    // Сохраняем колбэки до вызова суперкласса
    // Это позволит нам использовать их позже
    const onSubmit = props.onSubmit;

    // Вызываем конструктор базового класса с безопасными параметрами
    super({
      title: props.title,
      fields: props.fields, // Передаем оригинальные поля
      buttonText: props.buttonText,
      linkText: props.linkText,
      styles,
      formFields, // Передаем обработанные поля
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

    // Используем сохраненный колбэк вместо this.props.onSubmit
    if (isFormValid && this._onSubmitCallback) {
      this._onSubmitCallback(e);
    } else {
      console.log('Форма содержит ошибки');
    }
  }

  protected render(): string {
    return template;
  }
}
