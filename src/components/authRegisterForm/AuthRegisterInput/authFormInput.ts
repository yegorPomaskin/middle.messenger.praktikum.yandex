// authFormInput.ts
import Block from "../../../framework/block";
import template from "./authFormInput.hbs?raw";
import styles from "./authFormInput.module.css";
import { Validator, ValidationRule } from "../../../utils/validator";

export interface AuthInputProps {
  label: string;
  name: string;
  type: string;
  required: boolean;
  value?: string;
  errorText?: string;
  validationRules?: ValidationRule[];
}

export class AuthInput extends Block {
  private validator: Validator | null = null;
  
  constructor(props: AuthInputProps) {
    super({
      ...props,
      styles,
      value: props.value || '',
      errorText: props.errorText || '',
      events: {
        blur: (e: FocusEvent) => this.onBlur(e)
      }
    });
    
    // Создаем валидатор, если есть правила
    if (props.validationRules && props.validationRules.length > 0) {
      this.validator = new Validator(props.validationRules);
    }
  }
  
  private onBlur(e: FocusEvent): void {
    // Валидируем только при потере фокуса
    this.validate();
  }
  
  public validate(): boolean {
    if (!this.validator) return true;
    
    const input = this.element?.querySelector('input') as HTMLInputElement;
    if (!input) return true;
    
    const result = this.validator.validate(input.value);
    
    if (!result.isValid) {
      this.setProps({ errorText: result.errorMessage || '' });
      return false;
    } else {
      this.setProps({ errorText: '' });
      return true;
    }
  }

  public getName(): string {
    return this.props.name;
  }
  
  public getValue(): string {
    const input = this.element?.querySelector('input') as HTMLInputElement;
    return input ? input.value : '';
  }
  
  protected render(): string {
    return template;
  }
}