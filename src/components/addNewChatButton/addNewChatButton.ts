import Block, { BlockProps } from '../../framework/block';

import template from './addNewChatButton.hbs?raw';
import styles from './addNewChatButton.module.css';

interface AddNewChatButtonProps extends BlockProps {
  [key: string]: unknown;
  onClick?: (event: Event) => void;
  styles?: Record<string, string>;
}

export class AddNewChatButton extends Block<AddNewChatButtonProps> {
  constructor(props: AddNewChatButtonProps) {
    super({
      ...props,
      styles,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Add chat button clicked');

          if (props.onClick) {
            props.onClick(e);
          }
        },
      },
    });
  }

  protected render(): string {
    return template;
  }
}
