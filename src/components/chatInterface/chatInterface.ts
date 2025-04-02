import Block from '../../framework/block';

import template from './chatInterface.hbs?raw';
import styles from './chatInterface.module.css';

export interface Message {
  userName: string;
  time: string;
  text: string;
}

export interface ChatInterfaceProps {
  messages: Message[];
  attachment: string;
  sendButton: string;
  events?: Record<string, (e: Event) => void>;
}

export class ChatInterface extends Block {
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
    return this.props.messages || [];
  }

  protected render(): string {
    return template;
  }
}
