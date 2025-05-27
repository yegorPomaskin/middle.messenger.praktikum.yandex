// src/pages/chat.ts
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

interface ChatPageProps extends BlockProps {
  [key: string]: unknown;
  activeChatId?: number;
  attachment: string;
  sendButton: string;
}

export class ChatPage extends Block<ChatPageProps> {
  private chatsData: Array<{
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isActive: boolean;
  }> = [];

  private chatInterface: ChatInterface | null = null;

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

    const messages: Message[] = [];

    const chatItems = chatsData.map(
      (chatData) =>
        new ChatItem({
          ...chatData,
          events: {
            click: (e: Event) => {
              e.preventDefault();
              this.selectChat(chatData.id);
            },
          },
        }),
    );

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
          router.go('/settings');
        },
      },
    });

    const addNewChatButton = new AddNewChatButton({
      onClick: (e: Event) => {
        this.handleCreateChatWithUsers();
      },
    });

    super({
      ...props,
      chatItems,
      chatInterface,
      profileLink,
      addNewChatButton,
      styles,
    });

    this.chatsData = chatsData;
    this.chatInterface = chatInterface;
  }

  protected componentDidMount(): void {
    this.loadChats();
  }

  private async loadChats(): Promise<void> {
    try {
      await ChatController.loadChats();
      
      const serverChats = ChatController.getChats();
      
      if (serverChats.length > 0) {
        this.chatsData = serverChats.map(chat => ({
          id: chat.id,
          name: chat.title,
          avatar: chat.avatar || '/avatar.png',
          lastMessage: chat.last_message?.content || 'Нет сообщений',
          time: chat.last_message?.time ? 
            new Date(chat.last_message.time).toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '',
          unreadCount: chat.unread_count,
          isActive: this.props.activeChatId === chat.id,
        }));

        // Используем recreate только при первой загрузке
        this.recreateChatItems();
        
        const activeChatId = this.props.activeChatId as number;
        if (activeChatId && this.chatInterface) {
          await this.chatInterface.setActiveChat(activeChatId);
        }
      }
      
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

      // УБИРАЕМ this.setProps - это вызывало ререндер!
      // this.setProps({ activeChatId: chatId });
      
      // Обновляем данные чатов БЕЗ ререндера родителя
      this.chatsData = this.chatsData.map(chat => ({
        ...chat,
        isActive: chat.id === chatId
      }));

      // Обновляем только состояние существующих чатов
      this.updateChatItemsState();

      if (this.chatInterface) {
        try {
          await this.chatInterface.setActiveChat(chatId);
          
          if (!this.chatInterface.isConnected()) {
            alert('Не удалось подключиться к чату. Проверьте подключение к интернету.');
            return;
          }
        } catch (wsError) {
          console.error('Ошибка WebSocket подключения:', wsError);
          alert('Ошибка подключения к чату. Попробуйте позже.');
          return;
        }
      }

      ChatController.setActiveChat(chatId);
      
    } catch (error) {
      console.error('Ошибка выбора чата:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка подключения к чату: ${errorMessage}`);
    }
  }

  private async handleCreateChatWithUsers(): Promise<void> {
    try {
      const chatName = prompt('Введите название нового чата:');
      
      if (!chatName || chatName.trim().length < 2) {
        if (chatName !== null) {
          alert('Название должно содержать минимум 2 символа');
        }
        return;
      }

      const userLogin = prompt('Введите логин пользователя для добавления в чат:');
      
      if (!userLogin || userLogin.trim().length === 0) {
        if (userLogin !== null) {
          alert('Логин пользователя не может быть пустым');
        }
        return;
      }

      const users = await UserController.searchUsers(userLogin.trim());
      
      if (users.length === 0) {
        alert(`Пользователь с логином "${userLogin.trim()}" не найден`);
        return;
      }

      const userToAdd = users[0];

      await ChatController.createChat(chatName.trim());
      await this.loadChats();

      const newChat = this.chatsData[0];
      if (!newChat) {
        throw new Error('Не удалось найти созданный чат');
      }

      await ChatController.addUsersToChat(newChat.id, [userToAdd.id]);
      await this.selectChat(newChat.id);

      alert(`Чат "${chatName.trim()}" создан и пользователь ${userToAdd.login} добавлен!`);
      
    } catch (error) {
      console.error('Ошибка создания чата с пользователями:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка создания чата: ${errorMessage}`);
    }
  }

  // Новый метод для обновления состояния чатов без пересоздания
  private updateChatItemsState(): void {
    // Обновляем состояние существующих ChatItem вместо пересоздания
    if (this.lists && this.lists.chatItems) {
      this.lists.chatItems.forEach((chatItem, index) => {
        if (chatItem instanceof ChatItem && this.chatsData[index]) {
          chatItem.setProps({
            isActive: this.chatsData[index].isActive
          });
        }
      });
    }
  }

  // Переименованный старый метод - используется только при загрузке
  private recreateChatItems(): void {
    const newChatItems = this.chatsData.map(
      (chatData) =>
        new ChatItem({
          ...chatData,
          events: {
            click: (e: Event) => {
              e.preventDefault();
              this.selectChat(chatData.id);
            },
          },
        }),
    );
    
    this.setList({ chatItems: newChatItems });
  }

  protected componentWillUnmount(): void {
    if (this.chatInterface) {
      this.chatInterface.disconnectFromChat();
    }
    
    WebSocketManager.disconnect();
  }

  protected render(): string {
    return template;
  }
}