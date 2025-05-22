import { ChatInterface, Message } from '../components/chatInterface/chatInterface';
import { ChatItem } from '../components/chatItem/chatItem';
import { Link } from '../components/link/link';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';
import styles from '../styles/pages/chat.module.css';
import template from '../templates/chat.hbs?raw';

interface ChatPageProps extends BlockProps {
  [key: string]: unknown;
  activeChatId?: number;
  attachment: string;
  sendButton: string;
}

export class ChatPage extends Block<ChatPageProps> {
  constructor(props: ChatPageProps) {

    const chatsData = [
      {
        id: 1,
        name: 'Андрей',
        avatar: '/avatar.png',
        lastMessage: 'Привет!',
        time: '10:49',
        unreadCount: 2,
        isActive: props.activeChatId === 1,
      },
      {
        id: 2,
        name: 'Виктор',
        avatar: '/avatar.png',
        lastMessage: 'Как дела?',
        time: '10:52',
        unreadCount: 0,
        isActive: props.activeChatId === 2,
      },
      {
        id: 3,
        name: 'Лешка',
        avatar: '/avatar.png',
        lastMessage: 'Как дела?',
        time: '10:52',
        unreadCount: 0,
        isActive: props.activeChatId === 3,
      },
    ];

    const messages: Message[] = [
      { userName: 'Андрей', time: '10:49', text: 'Привет, как дела?' },
      { userName: 'Виктор', time: '10:52', text: 'Все хорошо, а у тебя?' },
    ];

    // Создаем компоненты для каждого чата
    const chatItems = chatsData.map(
      (chatData) =>
        new ChatItem({
          ...chatData,
          events: {
            click: (e: Event) => {
              e.preventDefault();
              this.setProps({ activeChatId: chatData.id });

              // Обновляем состояние каждого чата в списке
              if (this.lists?.chatItems) {
                this.lists.chatItems.forEach((item) => {
                  if (item instanceof ChatItem) {
                    item.setProps({ isActive: item.getId() === chatData.id });
                  }
                });
              }
            },
          },
        }),
    );

    // Создаем компонент интерфейса чата
    const chatInterface = new ChatInterface({
      messages,
      attachment: props.attachment,
      sendButton: props.sendButton,
    });

    const profileLink = new Link({
      text: 'Профиль',
      href: '/settings',
      className: 'chat__item-link',
      useDefaultClass: false,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Переход на страницу профиля');
          router.go('/settings');
        },
      },
    });

    super({
      ...props,
      chatItems,
      chatInterface,
      profileLink,
      styles,
    });
  }

  protected render(): string {
    return template;
  }
}
