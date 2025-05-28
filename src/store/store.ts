import { UserData } from '../api/authAPI';
import { ChatData } from '../api/chatAPI';
import EventBus from '../framework/eventBus';
import { set, get } from '../utils/helpers';
import { MessageData } from '../utils/webSocketManager';

import { StoreEvents } from './storeEvents';

export interface AppState {
  [key: string]: unknown;
  user: {
    currentUser: UserData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  chats: {
    list: ChatData[];
    currentChatId: number | null;
    messages: MessageData[];
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
    chatUsers: UserData[];
  };
}

class Store extends EventBus {
  private state: AppState;

  constructor() {
    super();

    this.state = {
      user: {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      chats: {
        list: [],
        currentChatId: null,
        messages: [],
        isLoading: false,
        isConnected: false,
        error: null,
        chatUsers: [],
      },
    };
  }

  // Установить значение по пути
  public set(path: string, value: unknown): void {
    const oldValue = get(this.state, path);

    if (oldValue !== value) {
      set(this.state, path, value);

      console.log('🔄 Store обновлен:', { path, oldValue, newValue: value });

      // Уведомляем подписчиков через EventBus
      this.emit(StoreEvents.Updated, { path, value, state: this.getState() });
    }
  }

  public get(path: string): unknown {
    return get(this.state, path);
  }

  public getState(): AppState {
    return JSON.parse(JSON.stringify(this.state)); // Deep clone
  }

  // === МЕТОДЫ ДЛЯ ПОЛЬЗОВАТЕЛЯ ===

  public setCurrentUser(user: UserData | null): void {
    this.set('user.currentUser', user);
    this.set('user.isAuthenticated', user !== null);
  }

  public getCurrentUser(): UserData | null {
    return this.get('user.currentUser') as UserData | null;
  }

  public setUserLoading(isLoading: boolean): void {
    this.set('user.isLoading', isLoading);
  }

  public setUserError(error: string | null): void {
    this.set('user.error', error);
  }

  public isAuthenticated(): boolean {
    return this.get('user.isAuthenticated') as boolean;
  }

  public logoutUser(): void {
    this.set('user.currentUser', null);
    this.set('user.isAuthenticated', false);
    this.set('user.error', null);
  }

  // === МЕТОДЫ ДЛЯ ЧАТОВ ===

  public setChats(chats: ChatData[]): void {
    this.set('chats.list', chats);
  }

  public getChats(): ChatData[] {
    return this.get('chats.list') as ChatData[];
  }

  public addChat(chat: ChatData): void {
    const currentChats = this.getChats();
    this.set('chats.list', [...currentChats, chat]);
  }

  public setCurrentChat(chatId: number | null): void {
    this.set('chats.currentChatId', chatId);
    this.set('chats.messages', []); // Очищаем сообщения при смене чата
  }

  public getCurrentChatId(): number | null {
    return this.get('chats.currentChatId') as number | null;
  }

  public getCurrentChat(): ChatData | null {
    const chatId = this.getCurrentChatId();
    if (!chatId) return null;

    const chats = this.getChats();
    return chats.find((chat) => chat.id === chatId) || null;
  }

  public setMessages(messages: MessageData[]): void {
    this.set('chats.messages', messages);
  }

  public getMessages(): MessageData[] {
    return this.get('chats.messages') as MessageData[];
  }

  public addMessage(message: MessageData): void {
    const currentMessages = this.getMessages();
    this.set('chats.messages', [...currentMessages, message]);
  }

  public addMessagesHistory(messages: MessageData[]): void {
    const currentMessages = this.getMessages();
    // Добавляем историю в начало (история приходит от новых к старым)
    this.set('chats.messages', [...messages.reverse(), ...currentMessages]);
  }

  public setChatLoading(isLoading: boolean): void {
    this.set('chats.isLoading', isLoading);
  }

  public setChatConnected(isConnected: boolean): void {
    this.set('chats.isConnected', isConnected);
  }

  public setChatError(error: string | null): void {
    this.set('chats.error', error);
  }

  public setChatUsers(users: UserData[]): void {
    this.set('chats.chatUsers', users);
  }

  // === УТИЛИТЫ ===

  public clearChatMessages(): void {
    this.set('chats.messages', []);
  }

  public clearChatError(): void {
    this.set('chats.error', null);
  }

  public clearUserError(): void {
    this.set('user.error', null);
  }

  public reset(): void {
    this.state = {
      user: {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
      chats: {
        list: [],
        currentChatId: null,
        messages: [],
        isLoading: false,
        isConnected: false,
        error: null,
        chatUsers: [],
      },
    };

    this.emit(StoreEvents.Updated, { path: 'reset', value: null, state: this.getState() });
  }

  // === ПОДПИСКИ НА КОНКРЕТНЫЕ ИЗМЕНЕНИЯ ===

  // Подписаться на изменения пользователя
  public onUserChange(callback: (user: UserData | null) => void): () => void {
    const handler = () => {
      callback(this.getCurrentUser());
    };

    this.on(StoreEvents.Updated, handler);

    // Возвращаем функцию отписки
    return () => {
      this.off(StoreEvents.Updated, handler);
    };
  }

  // Подписаться на изменения чатов
  public onChatsChange(callback: (chats: ChatData[]) => void): () => void {
    const handler = () => {
      callback(this.getChats());
    };

    this.on(StoreEvents.Updated, handler);

    return () => {
      this.off(StoreEvents.Updated, handler);
    };
  }

  // Подписаться на изменения сообщений
  public onMessagesChange(callback: (messages: MessageData[]) => void): () => void {
    const handler = () => {
      callback(this.getMessages());
    };

    this.on(StoreEvents.Updated, handler);

    return () => {
      this.off(StoreEvents.Updated, handler);
    };
  }

  // Подписаться на изменения текущего чата
  public onCurrentChatChange(callback: (chatId: number | null) => void): () => void {
    const handler = () => {
      callback(this.getCurrentChatId());
    };

    this.on(StoreEvents.Updated, handler);

    return () => {
      this.off(StoreEvents.Updated, handler);
    };
  }
}

// Экспортируем единственный экземпляр
export default new Store();
