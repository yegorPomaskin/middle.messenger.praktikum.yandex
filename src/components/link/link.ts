import Block, { BlockProps } from '../../framework/block';

import styles from './link.module.css';

interface LinkProps extends BlockProps {
  [key: string]: unknown;
  text: string;
  className?: string;
  events?: {
    click?: (event: Event) => void;
  };
  href?: string;
  useDefaultClass?: boolean;
  label?: string;
  attr?: {
    'data-action': string;
  };
  styles?: Record<string, string>;
}

export class Link extends Block<LinkProps> {
  constructor(props: LinkProps) {
    const baseClass = props.useDefaultClass === false ? '' : styles.link;

    super({
      ...props,
      className: `${baseClass} ${props.className || ''}`.trim(),
      events: {
        click: (e: Event) => {
          e.preventDefault();
          props.events?.click?.(e);
        },
      },
    });
  }

  protected render(): string {
    return `
            <a href="${this.props.href || '#'}"
                class="${this.props.className}"
                data-action="back">
                ${this.props.text}
            </a>
        `;
  }
}
