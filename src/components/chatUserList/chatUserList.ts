import Handlebars from 'handlebars';
import Block, { BlockProps } from '../../framework/block';
import template from './chatUserList.hbs?raw';
import styles from './chatUserList.module.css';

interface ChatUsersListProps extends BlockProps {
  users: Array<{ id: number; login: string }>;
  onRemoveUser?: (userId: number) => void;
}

const compiledTemplate = Handlebars.compile(template);

export class ChatUsersList extends Block<ChatUsersListProps> {
  constructor(props: ChatUsersListProps) {
    console.log('ChatUsersList props:', props);
    console.log('ChatUsersList users:', props.users);
    super({
      ...props,
      styles,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.dataset.action === 'remove-user') {
            const userId = Number(target.dataset.userId);
            this.props.onRemoveUser?.(userId);
          }
        },
      },
    });
  }

  protected render(): string {
    console.log(styles);
    return compiledTemplate({
      ...this.props,
      styles, // гарантировано будет доступен в шаблоне
    });
  }
}
