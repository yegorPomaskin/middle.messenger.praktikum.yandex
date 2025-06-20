import Block, { BlockProps } from '../../framework/block';
import { ValidationRule } from '../../utils/validator';
import { Input } from '../input/input';

import styles from './commonProfileStyles.module.css';
import template from './profileField.hbs?raw';

interface ProfileFieldProps extends BlockProps {
  [key: string]: unknown;
  name: string;
  label: string;
  value: string;
  type?: string;
  mode?: 'view' | 'edit';
  editable?: boolean;
  validationRules?: ValidationRule[];
  required?: boolean;
  errorText?: string;
  events?: Record<string, EventListenerOrEventListenerObject>;
}

export class ProfileField extends Block<ProfileFieldProps> {
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
        focus: ((e: Event) => {
          if (props.events?.focus) {
            (props.events.focus as EventListener)(e);
          }
        }) as EventListener,
        blur: ((e: Event) => {
          this._handleInputBlur.bind(this)(e as FocusEvent, props);
        }) as EventListener,
        input: ((e: Event) => {
          const target = e.target as HTMLInputElement;
          // Сохраняем значение в локальной переменной
          const value = target.value;
          // Используем setTimeout, чтобы обновить _currentValue после инициализации
          setTimeout(() => {
            this._currentValue = value;
            if (props.events?.change) {
              (props.events.change as EventListener)(e);
            }
          }, 0);
        }) as EventListener,
      },
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
      const errorMessage =
        validationRules.find((rule: ValidationRule) => !rule.validator(this.input.getValue()))
          ?.errorMessage ?? 'Invalid input';

      this.setProps({
        errorText: errorMessage,
        error: true,
      });
      this.input.setError(true);
    } else {
      this.setProps({
        errorText: '',
        error: false,
      });
      this.input.setError(false);
    }
    // Вызываем оригинальный обработчик blur если он был передан
    if (props.events?.blur) {
      (props.events.blur as EventListener)(e);
    }
  }

  public validate(): boolean {
    const isValid = this.input.validate();

    // Безопасно получаем validationRules через type assertion
    const validationRules = this.props.validationRules as ValidationRule[] | undefined;

    if (!isValid && validationRules?.length) {
      const errorMessage =
        validationRules.find((rule: ValidationRule) => !rule.validator(this.input.getValue()))
          ?.errorMessage ?? 'Invalid input';

      // ВАЖНО: устанавливаем и error, и errorText
      this.setProps({
        errorText: errorMessage,
        error: true,
      });
      this.input.setError(true);
    } else {
      // Сбрасываем и error, и errorText
      this.setProps({
        errorText: '',
        error: false,
      });
      this.input.setError(false);
    }

    return isValid;
  }

  public getValue(): string {
    return this.input.getValue();
  }

  public getName(): string {
    return this.props.name as string;
  }

  protected render(): string {
    return template;
  }
}
