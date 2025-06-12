import Block, { BlockProps } from '../../framework/block';

import template from './sidebar.hbs?raw';
import styles from './sidebar.module.css';

export interface SidebarProps extends BlockProps {
  [key: string]: unknown;
  href: string;
  iconSrc: string;
  onClick?: (event: Event) => void;
}

export class Sidebar extends Block<SidebarProps> {
  constructor(props: SidebarProps) {
    super({
      ...props,
      styles,
      events: {
        click: props.onClick || (() => {}),
      },
    });
  }

  protected render(): string {
    return template;
  }
}
