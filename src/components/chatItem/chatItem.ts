import Block from '../../framework/block';

import template from './chatItem.hbs?raw';
import styles from './chatItem.module.css';

// Расширяем интерфейс BlockProps, который используется в Block
interface BlockProps {
  [key: string]: any;
  events?: Record<string, (e: Event) => void>;
}

export interface ChatItemProps extends BlockProps {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
}

export class ChatItem extends Block {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      styles,
    });
  }

  // Метод для безопасного получения ID чата
  public getId(): number {
    return this.props.id;
  }

  protected render(): string {
    return template;
  }
}
