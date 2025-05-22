import Block, { BlockProps } from '../../framework/block';

import template from './chatInterface.hbs?raw';
import styles from './chatInterface.module.css';

export interface Message {
  userName: string;
  time: string;
  text: string;
}

export interface ChatInterfaceProps extends BlockProps {
  [key: string]: unknown;
  messages: Message[];
  attachment: string;
  sendButton: string;
  events?: Record<string, (e: Event) => void>;
  styles?: Record<string, string>;
}

export class ChatInterface extends Block<ChatInterfaceProps> {
  constructor(props: ChatInterfaceProps) {
    super({
      ...props,
      styles,
      events: {
        submit: (e: Event) => {
          if (props.events?.submit) {
            props.events.submit(e);
          }
        },
      },
    });
  }

  // Метод для получения сообщений
  public getMessage(): Message[] {
    return Array.isArray(this.props.messages) ? this.props.messages : [];
  }

  protected render(): string {
    return template;
  }
}
