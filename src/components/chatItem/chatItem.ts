import Block from '../../framework/block';

import template from './chatItem.hbs?raw';
import styles from './chatItem.module.css';

export interface ChatItemProps {
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
    return this.props.id as number;
  }

  protected render(): string {
    return template;
  }
}
