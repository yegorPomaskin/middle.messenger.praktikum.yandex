// InputField.ts
import Block from "../../framework/block";
import { ValidationRule, Validator } from "../../utils/validator";
import styles from "./InputField.module.css";

interface InputFieldProps {
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

export class InputField extends Block {
  private validator: Validator | null = null;
  
  constructor(props: InputFieldProps) {
    super({
      ...props,
      value: props.value || '',
      events: {
        ...props.events,
        blur: (e: FocusEvent) => {
          // Вызываем валидацию при потере фокуса
          this.validate();
          
          // Вызываем оригинальный обработчик blur, если он был передан
          if (props.events?.blur) {
            props.events.blur(e);
          }
        }
      }
    });
    
    // Создаем валидатор, если есть правила
    if (props.validationRules && props.validationRules.length > 0) {
      this.validator = new Validator(props.validationRules);
    }
  }
  
  public validate(): boolean {
    if (!this.validator) return true;
    
    const input = this.element as HTMLInputElement;
    const result = this.validator.validate(input.value);
    
    // Возвращаем результат валидации
    return result.isValid;
  }
  
  public getValue(): string {
    const input = this.element as HTMLInputElement;
    return input ? input.value : '';
  }
  
  public getName(): string {
    return this.props.name;
  }
  
  protected render(): string {
    // Возвращаем напрямую HTML для input
    return `
      <input 
        class="${styles.input} ${this.props.error ? styles.inputError : ''}"
        type="${this.props.type}" 
        name="${this.props.name}" 
        value="${this.props.value}"
        ${this.props.required ? 'required' : ''}
      >
    `;
  }
}