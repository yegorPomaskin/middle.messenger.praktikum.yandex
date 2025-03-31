import Block from '../../framework/block';
import { ValidationRule } from '../../utils/validator';
import { Input } from '../input/input';

import template from './formField.hbs?raw';
import styles from './formField.module.css';

/**
 * Компонент поля формы с меткой и отображением ошибок
 * Оборачивает базовый компонент Input и добавляет функциональность валидации
 */

export interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  required: boolean;
  value?: string;
  errorText?: string;
  validationRules?: ValidationRule[];
  events?: {
    focus?: (e: FocusEvent) => void;
    blur?: (e: FocusEvent) => void;
    change?: (e: Event) => void;
    input?: (e: Event) => void;
  };
}

export class FormField extends Block {
  private input: Input;

  constructor(props: FormFieldProps) {
    const input = new Input({
      name: props.name,
      type: props.type,
      value: props.value ?? '',
      required: props.required,
      validationRules: props.validationRules,
      events: {
        focus: props.events?.focus,
        blur: (e: FocusEvent) => this._handleInputBlur(e, props),
        input: props.events?.input,
        change: props.events?.change,
      },
    });

    super({
      ...props,
      styles,
      input,
      errorText: props.errorText ?? '',
    });

    this.input = input;
  }

  /**
   * Обрабатывает событие потери фокуса полем ввода
   */
  private _handleInputBlur(e: FocusEvent, props: FormFieldProps): void {
    const isValid = this.input.validate();

    if (!isValid && props.validationRules?.length) {
      // Находим сообщение об ошибке из первого неуспешного правила
      const errorMessage =
        props.validationRules.find((rule: ValidationRule) => !rule.validator(this.input.getValue()))
          ?.errorMessage ?? 'Invalid input';

      this.setProps({ errorText: errorMessage });
      this.input.setError(true);
    } else {
      this.setProps({ errorText: '' });
      this.input.setError(false);
    }

    // Вызываем оригинальный обработчик blur если он был передан
    if (props.events?.blur) {
      props.events.blur(e);
    }
  }

  /**
   * Проверяет введенное значение по установленным правилам валидации
   */
  public validate(): boolean {
    const isValid = this.input.validate();

    if (!isValid && this.props.validationRules?.length) {
      const errorMessage =
        this.props.validationRules.find(
          (rule: ValidationRule) => !rule.validator(this.input.getValue()),
        )?.errorMessage ?? 'Invalid input';

      this.setProps({ errorText: errorMessage });
      this.input.setError(true);
    } else {
      this.setProps({ errorText: '' });
      this.input.setError(false);
    }

    return isValid;
  }

  /**
   * Возвращает имя поля
   */
  public getName(): string {
    return this.props.name;
  }
  /**
   * Возвращает текущее значение поля
   */
  public getValue(): string {
    return this.input.getValue();
  }

  protected render(): string {
    return template;
  }
}
