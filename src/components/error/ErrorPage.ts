import Block from '../../framework/block';
import { Link } from '../link/link';

import template from './error.hbs?raw';
import styles from './error.module.css';

interface ErrorPageProps {
  errorName: string;
  errorText: string;
  linkText: string;
  onLinkClick?: (event: Event) => void;
}

export class ErrorPage extends Block {
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
