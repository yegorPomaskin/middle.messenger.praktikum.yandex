import { ChatInterface, Message } from '../components/chatInterface/chatInterface';
import { ChatItem } from '../components/chatItem/chatItem';
import { Link } from '../components/link/link';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';
import styles from '../styles/pages/chat.module.css';
import template from '../templates/chat.hbs?raw';
import { AddNewChatButton } from '../components/addNewChatButton/addNewChatButton';
import ChatController from '../controllers/ChatController';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import WebSocketManager from '../utils/webSocketManager';
import { MessageData } from '../utils/webSocketManager';

interface ChatPageProps extends BlockProps {
  attachment: string;
  sendButton: string;
}

export class ChatPage extends Block<ChatPageProps> {
  private chatInterface: ChatInterface | null = null;
  private unsubscribeFromChats: (() => void) | null = null;
  private unsubscribeFromMessages: (() => void) | null = null;

  constructor(props: ChatPageProps) {
    const chatInterface = new ChatInterface({
      messages: [],
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
          router.go('/settings');
        },
      },
    });

    const addNewChatButton = new AddNewChatButton({
      onClick: () => this.handleCreateChatWithUsers(),
    });

    super({
      ...props,
      chatItems: [],
      chatInterface,
      profileLink,
      addNewChatButton,
      styles,
    });

    this.chatInterface = chatInterface;
  }

  protected componentDidMount(): void {
    // Подписка на изменение чатов
    this.unsubscribeFromChats = ChatController.onChatsChange(() => {
      this.renderChatsFromStore();
    });

    // Подписка на изменение сообщений (для активного чата)
    this.unsubscribeFromMessages = ChatController.onMessagesChange((messages: MessageData[]) => {
      const currentChatId = ChatController.getCurrentChatId();
      const currentUser = AuthController.getUserData();

      if (this.chatInterface && currentChatId) {
        const transformedMessages: Message[] = messages.map((msg) => ({
          userName: `Пользователь #${msg.user_id}`,
          text: msg.content,
          userId: msg.user_id,
          isOwn: Number(msg.user_id) === currentUser?.id,
          time: msg.time || '',
          type: 'message',
        }));
        this.chatInterface.setProps({ messages: transformedMessages });
      }
    });

    // Первая загрузка чатов
    this.loadChats();
  }

  protected componentWillUnmount(): void {
    this.unsubscribeFromChats?.();
    this.unsubscribeFromMessages?.();
    this.chatInterface?.disconnectFromChat();
    WebSocketManager.disconnect();
  }

  // Формирует чат-лист из актуального стора
  private renderChatsFromStore(): void {
    const chats = ChatController.getChats();
    const activeChatId = ChatController.getCurrentChatId();

    const chatItems = chats.map(
      (chat) =>
        new ChatItem({
          id: chat.id,
          name: chat.title,
          avatar: chat.avatar || '/avatar.png',
          lastMessage: chat.last_message?.content || 'Нет сообщений',
          time: chat.last_message?.time
            ? new Date(chat.last_message.time).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          unreadCount: chat.unread_count,
          isActive: activeChatId === chat.id,
          events: {
            click: (e: Event) => {
              e.preventDefault();
              const target = e.target as HTMLElement;
              if (target.dataset.action === 'delete') {
                this.handleDeleteChat(chat.id);
              } else {
                this.selectChat(chat.id);
              }
            },
          },
        })
    );

    this.setList({ chatItems });

    // Если нет чатов, очищаем сообщения
    if (chatItems.length === 0 && this.chatInterface) {
      this.chatInterface.clearMessages();
    }
  }

  private async loadChats(): Promise<void> {
    try {
      await ChatController.loadChats();
      // UI обновится по подписке на Store
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    }
  }

  private async selectChat(chatId: number): Promise<void> {
    try {
      const currentUser = AuthController.getUserData();
      if (!currentUser) {
        alert('Необходимо войти в систему для использования чата');
        router.go('/');
        return;
      }

      ChatController.setActiveChat(chatId);

      if (this.chatInterface) {
        await this.chatInterface.setActiveChat(chatId);
      }
    } catch (error) {
      console.error('Ошибка выбора чата:', error);
      alert(
        `Ошибка подключения к чату: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  }

  private async handleDeleteChat(chatId: number): Promise<void> {
    if (!confirm('Вы точно хотите удалить этот чат?')) return;
    try {
      await ChatController.deleteChat(chatId);
      alert('Чат удалён');
      // UI обновится автоматически по подписке
    } catch (error) {
      console.error('Ошибка удаления чата:', error);
      alert('Не удалось удалить чат');
    }
  }

  private async handleCreateChatWithUsers(): Promise<void> {
    try {
      const chatName = prompt('Введите название нового чата:');
      if (!chatName || chatName.trim().length < 2) {
        if (chatName !== null) alert('Название должно содержать минимум 2 символа');
        return;
      }

      const userLogin = prompt('Введите логин пользователя для добавления в чат:');
      if (!userLogin || userLogin.trim().length === 0) {
        if (userLogin !== null) alert('Логин пользователя не может быть пустым');
        return;
      }

      const users = await UserController.searchUsers(userLogin.trim());
      if (users.length === 0) {
        alert(`Пользователь с логином "${userLogin.trim()}" не найден`);
        return;
      }

      const userToAdd = users[0];

      await ChatController.createChat(chatName.trim());

      // Ждём обновления чатов, находим только что созданный
      const allChats = ChatController.getChats();
      const newChat = allChats[0];
      if (!newChat) throw new Error('Не удалось найти созданный чат');

      await ChatController.addUsersToChat(newChat.id, [userToAdd.id]);
      await this.selectChat(newChat.id);

      alert(`Чат "${chatName.trim()}" создан и пользователь ${userToAdd.login} добавлен!`);
    } catch (error) {
      console.error('Ошибка создания чата с пользователями:', error);
      alert(
        `Ошибка создания чата: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  }

  protected render(): string {
    return template;
  }
}
