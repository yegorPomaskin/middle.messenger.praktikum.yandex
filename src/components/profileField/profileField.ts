import Block from '../../framework/block';
import { Input } from '../input/input';
import { ValidationRule } from '../../utils/validator';

import styles from './commonProfileStyles.module.css';
import template from './profileField.hbs?raw';

interface ProfileFieldProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  mode?: 'view' | 'edit';
  editable?: boolean;
  validationRules?: ValidationRule[];
  required?: boolean;
  errorText?: string;
  events?: {
    focus?: (event: FocusEvent) => void;
    blur?: (event: FocusEvent) => void;
    change?: (event: Event) => void;
  };
}

export class ProfileField extends Block {
  private input: Input;
  private _currentValue: string = '';

  constructor(props: ProfileFieldProps) {
    const mode = props.mode || 'view';

    // 1. Сначала создаем инпут (без доступа к this)
    const input = new Input({
      name: props.name,
      type: props.type || 'text',
      value: props.value,
      required: props.required,
      validationRules: props.validationRules,
      className: styles.profile__input,
      events: {
        focus: (e: FocusEvent) => props.events?.focus?.(e),
        blur: (e: FocusEvent) => this._handleInputBlur(e, props),
        input: (e: Event) => {
          this._currentValue = (e.target as HTMLInputElement).value;
          props.events?.change?.(e);
        }
      }
    });

    // 2. Вызываем super() перед использованием this
    super({
      ...props,
      styles,
      input,
      isViewMode: mode === 'view',
      isPassword: props.type === 'password',
      editable: props.editable !== false,
      // ВАЖНО: добавляем явно error 
      error: false,
      errorText: props.errorText ?? '',
    }); 

    this.input = input;
    this._currentValue = props.value;
    this.setProps({ value: this._currentValue });
  }

  private _handleInputBlur(e: FocusEvent, props: ProfileFieldProps): void {
    const isValid = this.input.validate();
    
    // Используем явное приведение типов
    const validationRules = props.validationRules ?? [];
    
    if (!isValid && validationRules.length > 0) {
      const errorMessage = validationRules
        .find((rule: ValidationRule) => !rule.validator(this.input.getValue()))
        ?.errorMessage ?? 'Invalid input';
      
      this.setProps({ 
        errorText: errorMessage,
        error: true 
      });
      this.input.setError(true);
    } else {
      this.setProps({ 
        errorText: '',
        error: false 
      });
      this.input.setError(false);
    }
  }

  public validate(): boolean {
    console.log(`ProfileField.validate() called for ${this.props.name}`);
  
    const isValid = this.input.validate();
  
    console.log(`Input validation result for ${this.props.name}: ${isValid}`);
  
    if (!isValid && this.props.validationRules?.length) {
      const errorMessage = this.props.validationRules.find(
        (rule: ValidationRule) => !rule.validator(this.input.getValue())
      )?.errorMessage ?? 'Invalid input';
  
      // ВАЖНО: устанавливаем и error, и errorText
      this.setProps({ 
        errorText: errorMessage,
        error: true 
      });
      this.input.setError(true);
    } else {
      // Сбрасываем и error, и errorText
      this.setProps({ 
        errorText: '',
        error: false 
      });
      this.input.setError(false);
    }
  
    return isValid;
  }

  public getValue(): string {
    return this.input.getValue();
  }

  public getName(): string {
    return this.props.name;
  }

  protected render(): string {
    return template;
  }
}