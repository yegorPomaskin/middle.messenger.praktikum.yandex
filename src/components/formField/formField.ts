import Block, { BlockProps } from '../../framework/block';
import { ValidationRule } from '../../utils/validator';
import { Input } from '../input/input';

import template from './formField.hbs?raw';
import styles from './formField.module.css';

/**
 * Компонент поля формы для AUTH и REGISTER с меткой и отображением ошибок
 * Оборачивает базовый компонент Input и добавляет функциональность валидации
 */

export interface FormFieldProps extends BlockProps {
  [key: string]: unknown;
  label: string;
  name: string;
  type: string;
  required: boolean;
  value?: string;
  errorText?: string;
  validationRules?: ValidationRule[];
  events?: Record<string, EventListenerOrEventListenerObject>;
  input?: Input;
  styles?: Record<string, string>;
}

export class FormField extends Block<FormFieldProps> {
  private input: Input;

  constructor(props: FormFieldProps) {
    // Create Input instance with correct event handler types
    const input = new Input({
      name: props.name,
      type: props.type,
      value: props.value ?? '',
      required: props.required,
      validationRules: props.validationRules,
      events: {
        focus: props.events?.focus as EventListener,
        blur: ((e: Event) => {
          this._handleInputBlur(e as FocusEvent, props);
        }) as EventListener,
        input: props.events?.input as EventListener,
        change: props.events?.change as EventListener,
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
      (props.events.blur as EventListener)(e);
    }
  }

  /**
   * Проверяет введенное значение по установленным правилам валидации
   */
  public validate(): boolean {
    const isValid = this.input.validate();

    // Получаем validationRules безопасно
    const validationRules = this.props.validationRules as ValidationRule[] | undefined;

    if (!isValid && validationRules?.length) {
      const errorMessage =
        validationRules.find((rule: ValidationRule) => !rule.validator(this.input.getValue()))
          ?.errorMessage ?? 'Invalid input';

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
    return this.props.name as string;
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
