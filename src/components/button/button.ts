import Block, { BlockProps } from '../../framework/block';

import styles from './button.module.css';

interface ButtonProps extends BlockProps {
  [key: string]: unknown;
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'login' | 'register' | 'save' | 'cancel' | 'modal';
  attr?: Record<string, string>;
  events?: {
    click?: (event: Event) => void;
  };
}

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    // Базовый класс кнопки
    let buttonClass = styles.button;

    // Добавляем специфичный класс для варианта, если он указан
    if (props.variant) {
      buttonClass += ` ${styles[`button--${props.variant}`]}`;
    }

    // Добавляем дополнительные классы, если они переданы
    if (props.className) {
      buttonClass += ` ${props.className}`;
    }

    super({
      ...props,
      type: props.type || 'button',
      attr: {
        ...props.attr,
        type: props.type || 'button',
        class: buttonClass.trim(),
      },
    });
  }

  protected render(): string {
    return `
            <button
                {{#each attr}}
                    {{@key}}="{{this}}"
                {{/each}}
            >
                {{text}}
            </button>
        `;
  }
}
