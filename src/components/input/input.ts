/**
 * Базовый компонент поля ввода
 * Оптимизирован для предотвращения перерисовки при каждом вводе символа
 */
import Block from "../../framework/block";
import { ValidationRule, Validator } from "../../utils/validator";
import styles from "./Input.module.css";

interface InputProps {
  name: string;
  type: string;
  value?: string;
  required?: boolean;
  error?: boolean;
  validationRules?: ValidationRule[];
  events?: {
    blur?: (e: FocusEvent) => void;
    focus?: (e: FocusEvent) => void;
    input?: (e: Event) => void;
    change?: (e: Event) => void;
  };
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
        blur: (e: FocusEvent) => this._handleBlur(e, props.events?.blur),
        focus: (e: FocusEvent) => this._handleFocus(e, props.events?.focus),
        input: (e: Event) => this._handleInput(e, props.events?.input)
      }
    };
    
    super(safeProps);
    
    this._currentValue = safeProps.value;
    
    if (props.validationRules?.length) {
      this.validator = new Validator(props.validationRules);
    }
  }
  
  /**
   * Обрабатывает событие потери фокуса
   */
  private _handleBlur(e: FocusEvent, originalHandler?: (e: FocusEvent) => void): void {
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
  private _handleFocus(e: FocusEvent, originalHandler?: (e: FocusEvent) => void): void {
    if (originalHandler) {
      originalHandler(e);
    }
  }
  
  /**
   * Обрабатывает событие ввода
   * Обновляет только локальное значение без перерисовки компонента
   */
  private _handleInput(e: Event, originalHandler?: (e: Event) => void): void {
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
    return this.props.name;
  }
  
  /**
   * Устанавливает состояние ошибки
   */
  public setError(hasError: boolean): void {
    this.setProps({ error: hasError });
  }
  
  protected render(): string {
    const value = this._currentValue ?? '';
    
    return `
      <input 
        class="${styles.input} ${this.props.error ? styles.inputError : ''}"
        type="${this.props.type}" 
        name="${this.props.name}" 
        value="${value}"
        ${this.props.required ? 'required' : ''}
      >
    `;
  }
}