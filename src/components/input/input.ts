import Block, { BlockProps } from '../../framework/block';
import { ValidationRule, Validator } from '../../utils/validator';

import styles from './input.module.css';

interface InputProps extends BlockProps {
  [key: string]: unknown;
  name: string;
  type: string;
  value?: string;
  required?: boolean;
  error?: boolean;
  validationRules?: ValidationRule[];
  className?: string;
  events?: Record<string, EventListenerOrEventListenerObject>;
  styles?: Record<string, string>;
}

export class Input extends Block<InputProps> {
  private validator: Validator | null = null;

  private _currentValue: string = '';

  constructor(props: InputProps) {
    const safeProps = {
      ...props,
      value: props.value ?? '',
      events: {
        ...props.events,
        blur: ((e: Event) => {
          this._handleBlur(
            e as FocusEvent,
            props.events?.blur ? (props.events.blur as EventListener) : undefined,
          );
        }) as EventListener,
        focus: ((e: Event) => {
          this._handleFocus(
            e as FocusEvent,
            props.events?.focus ? (props.events.focus as EventListener) : undefined,
          );
        }) as EventListener,
        input: ((e: Event) => {
          this._handleInput(
            e,
            props.events?.input ? (props.events.input as EventListener) : undefined,
          );
        }) as EventListener,
      },
    };

    super(safeProps);

    this._currentValue = safeProps.value;

    this.setProps({ value: this._currentValue });

    if (props.validationRules?.length) {
      this.validator = new Validator(props.validationRules);
    }
  }

  private _handleBlur(e: FocusEvent, originalHandler?: EventListener): void {
    // При потере фокуса синхронизируем значение с props и валидируем
    this.setProps({ value: this._currentValue });
    this.validate();

    // Вызываем оригинальный обработчик если он был передан
    if (originalHandler) {
      originalHandler(e);
    }
  }

  private _handleFocus(e: FocusEvent, originalHandler?: EventListener): void {
    if (originalHandler) {
      originalHandler(e);
    }
  }

  private _handleInput(e: Event, originalHandler?: EventListener): void {
    const input = e.target as HTMLInputElement;
    this._currentValue = input.value;

    if (originalHandler) {
      originalHandler(e);
    }
  }

  public validate(): boolean {
    if (!this.validator) return true;

    const result = this.validator.validate(this._currentValue);
    return result.isValid;
  }

  public getValue(): string {
    return this._currentValue;
  }

  public getName(): string {
    return this.props.name as string;
  }

  public setError(hasError: boolean): void {
    this.setProps({ error: hasError });
  }

  protected render(): string {
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
