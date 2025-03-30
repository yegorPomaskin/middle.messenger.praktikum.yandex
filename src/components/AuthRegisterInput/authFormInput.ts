// authFormInput.ts
import Block from "../../framework/block";
import template from "./authFormInput.hbs?raw";
import styles from "./authFormInput.module.css";
import { ValidationRule } from "../../utils/validator";
import { InputField } from "../inputField/inputField";

export interface AuthInputProps {
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
  };
}

export class AuthInput extends Block {
  private inputField: InputField;
  
  constructor(props: AuthInputProps) {
    // Создаем инстанс InputField
    const inputField = new InputField({
      name: props.name,
      type: props.type,
      value: props.value || '',
      required: props.required,
      validationRules: props.validationRules,
      events: {
        focus: props.events?.focus,
        blur: (e: FocusEvent) => {
          // При потере фокуса валидируем и обновляем errorText
          const isValid = inputField.validate();
          
          if (!isValid && props.validationRules && props.validationRules.length > 0) {
            // Получаем сообщение об ошибке из первого неуспешного правила
            const errorMessage = props.validationRules.find(
              (rule: ValidationRule) => !rule.validator(inputField.getValue())
            )?.errorMessage || 'Invalid input';
            
            this.setProps({ errorText: errorMessage });
            inputField.setProps({ error: true });
          } else {
            this.setProps({ errorText: '' });
            inputField.setProps({ error: false });
          }
          
          // Вызываем оригинальный обработчик blur, если он был передан
          if (props.events?.blur) {
            props.events.blur(e);
          }
        },
        change: props.events?.change
      }
    });
    
    super({
      ...props,
      styles,
      inputField,
      errorText: props.errorText || '',
    });
    
    this.inputField = inputField;
  }
  
  public validate(): boolean {
    const isValid = this.inputField.validate();
    
    if (!isValid && this.props.validationRules && this.props.validationRules.length > 0) {
      // Получаем сообщение об ошибке из первого неуспешного правила
      const errorMessage = this.props.validationRules.find(
        (rule: ValidationRule) => !rule.validator(this.inputField.getValue())
      )?.errorMessage || 'Invalid input';
      
      this.setProps({ errorText: errorMessage });
      this.inputField.setProps({ error: true });
    } else {
      this.setProps({ errorText: '' });
      this.inputField.setProps({ error: false });
    }
    
    return isValid;
  }
  
  public getName(): string {
    return this.props.name;
  }
  
  public getValue(): string {
    return this.inputField.getValue();
  }
  
  protected render(): string {
    return template;
  }
}