import Block, { BlockProps } from '../../framework/block';
import { Link } from '../link/link';

import template from './error.hbs?raw';
import styles from './error.module.css';

interface ErrorPageProps extends BlockProps {
  [key: string]: unknown;
  errorName: string;
  errorText: string;
  linkText: string;
  onLinkClick?: (event: Event) => void;
  link?: Link;
  styles?: Record<string, string>;
}

export class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
      link: new Link({
        text: props.linkText,
        events: {
          click: props.onLinkClick,
        },
      }),
      styles,
    });
  }

  protected render(): string {
    return template;
  }
}
