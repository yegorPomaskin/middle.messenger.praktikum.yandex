import Block, { BlockProps } from '../../framework/block';

import template from './chatItem.hbs?raw';
import styles from './chatItem.module.css';

export interface ChatItemProps extends BlockProps {
  [key: string]: unknown;
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
  events?: {
    click?: EventListener;
  };
  styles?: Record<string, string>;
}

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super({
      ...props,
      styles,
    });
  }

  // Метод для безопасного получения ID чата
  public getId(): number {
    return this.props.id as number;
  }

  protected render(): string {
    return template;
  }
}
