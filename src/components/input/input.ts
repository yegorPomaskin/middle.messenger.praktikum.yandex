/**
 * Базовый компонент поля ввода
 * Оптимизирован для предотвращения перерисовки при каждом вводе символа
 */
import Block from '../../framework/block';
import { ValidationRule, Validator } from '../../utils/validator';

import styles from './input.module.css';

interface InputProps {
  name: string;
  type: string;
  value?: string;
  required?: boolean;
  error?: boolean;
  validationRules?: ValidationRule[];
  className?: string;
  events?: Record<string, EventListenerOrEventListenerObject>;
}

export class Input extends Block {
  private validator: Validator | null = null;
  
  private _currentValue: string = '';

  constructor(props: InputProps) {
    const safeProps = {
      ...props,
      value: props.value ?? '',
      events: {
        ...props.events,
        blur: ((e: Event) => {
          this._handleBlur(e as FocusEvent, 
            props.events?.blur ? (props.events.blur as EventListener) : undefined);
        }) as EventListener,
        focus: ((e: Event) => {
          this._handleFocus(e as FocusEvent, 
            props.events?.focus ? (props.events.focus as EventListener) : undefined);
        }) as EventListener,
        input: ((e: Event) => {
          this._handleInput(e, 
            props.events?.input ? (props.events.input as EventListener) : undefined);
        }) as EventListener,
      },
    };

    super(safeProps);

    // Инициализируем локальное значение
    this._currentValue = safeProps.value;

    // Синхронизируем с реактивной системой пропсов сразу
    this.setProps({ value: this._currentValue });

    if (props.validationRules?.length) {
      this.validator = new Validator(props.validationRules);
    }
  }

  /**
   * Обрабатывает событие потери фокуса
   */
  private _handleBlur(e: FocusEvent, originalHandler?: EventListener): void {
    // При потере фокуса синхронизируем значение с props и валидируем
    this.setProps({ value: this._currentValue });
    this.validate();

    // Вызываем оригинальный обработчик если он был передан
    if (originalHandler) {
      originalHandler(e);
    }
  }

  /**
   * Обрабатывает событие получения фокуса
   */
  private _handleFocus(e: FocusEvent, originalHandler?: EventListener): void {
    if (originalHandler) {
      originalHandler(e);
    }
  }

  /**
   * Обрабатывает событие ввода
   * Обновляет только локальное значение без перерисовки компонента
   */
  private _handleInput(e: Event, originalHandler?: EventListener): void {
    const input = e.target as HTMLInputElement;
    this._currentValue = input.value;

    if (originalHandler) {
      originalHandler(e);
    }
  }

  /**
   * Проверяет введенное значение по установленным правилам валидации
   */
  public validate(): boolean {
    if (!this.validator) return true;

    const result = this.validator.validate(this._currentValue);
    return result.isValid;
  }

  /**
   * Возвращает текущее значение поля
   */
  public getValue(): string {
    return this._currentValue;
  }

  /**
   * Возвращает имя поля
   */
  public getName(): string {
    // Use type assertion since the base Block class uses unknown type for props
    return this.props.name as string;
  }

  /**
   * Устанавливает состояние ошибки
   */
  public setError(hasError: boolean): void {
    this.setProps({ error: hasError });
  }

  protected render(): string {
    // Используем как локальное значение, так и значение из пропсов в качестве запасного варианта
    const value = this._currentValue || (this.props.value as string) || '';

    const inputClass = [
      styles.input,
      (this.props.className as string) || '',
      (this.props.error as boolean) ? styles.inputError : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
        <input 
          class="${inputClass}"
          type="${this.props.type as string}" 
          name="${this.props.name as string}" 
          value="${value}"
          ${(this.props.required as boolean) ? 'required' : ''}
        >
    `;
  }
}