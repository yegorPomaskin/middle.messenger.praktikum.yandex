// src/controllers/ChatController.ts
import ChatAPI, { ChatData } from '../api/chatAPI';
import Store from '../store/store';
import { MessageData } from '../utils/webSocketManager';

class ChatController {
  // Загрузить список чатов пользователя
  async loadChats(): Promise<void> {
    Store.setChatLoading(true);
    Store.clearChatError();

    try {
      const chats = await ChatAPI.request();
      Store.setChats(chats);

      const currentChatId = Store.getCurrentChatId();
      const chatExists = chats.some((chat) => chat.id === currentChatId);

      if (!chatExists) {
        Store.setCurrentChat(null);
      }
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка загрузки чатов');
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Создать новый чат
  async createChat(title: string): Promise<void> {
    if (!title || title.trim().length < 2) {
      throw new Error('Название чата должно содержать минимум 2 символа');
    }
    Store.setChatLoading(true);
    Store.clearChatError();

    try {
      await ChatAPI.create({ title: title.trim() });
      await this.loadChats();
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка создания чата');
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Удалить чат
  async deleteChat(chatId: number): Promise<void> {
    Store.setChatLoading(true);
    Store.clearChatError();

    try {
      await ChatAPI.deleteChat(chatId);
      await this.loadChats();
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка удаления чата');
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Добавить пользователей в чат
  async addUsersToChat(chatId: number, userIds: number[]): Promise<void> {
    if (!userIds?.length) {
      throw new Error('Необходимо указать хотя бы одного пользователя');
    }
    Store.setChatLoading(true);
    Store.clearChatError();

    try {
      await ChatAPI.addUsersToChat({ chatId, users: userIds });
    } catch (error) {
      Store.setChatError(
        error instanceof Error ? error.message : 'Ошибка добавления пользователей'
      );
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Удалить пользователей из чата
  async removeUsersFromChat(chatId: number, userIds: number[]): Promise<void> {
    if (!userIds?.length) {
      throw new Error('Необходимо указать хотя бы одного пользователя');
    }
    Store.setChatLoading(true);
    Store.clearChatError();

    try {
      await ChatAPI.removeUsersFromChat({ chatId, users: userIds });
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка удаления пользователей');
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Получить пользователей чата
  async getChatUsers(chatId: number): Promise<any[]> {
    try {
      return await ChatAPI.getChatUsers(chatId);
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка получения пользователей');
      throw error;
    }
  }

  // Получить токен для подключения к WebSocket
  async getChatToken(chatId: number): Promise<string> {
    try {
      const result = await ChatAPI.getChatToken(chatId);
      return result.token;
    } catch (error) {
      Store.setChatError(error instanceof Error ? error.message : 'Ошибка получения токена');
      throw error;
    }
  }

  // Получить количество непрочитанных сообщений
  async getNewMessagesCount(chatId: number): Promise<number> {
    try {
      const result = await ChatAPI.getNewMessagesCount(chatId);
      return result.unread_count;
    } catch {
      return 0;
    }
  }

  // Добавить новое сообщение в Store
  handleNewMessage(message: MessageData): void {
    Store.addMessage(message);
  }

  // Добавить историю сообщений в Store
  handleMessagesHistory(messages: MessageData[]): void {
    Store.addMessagesHistory(messages);
  }

  // Установить активный чат
  setActiveChat(chatId: number | null): void {
    Store.setCurrentChat(chatId);
  }

  // Получить список чатов из Store
  getChats(): ChatData[] {
    return Store.getChats();
  }

  // Получить ID текущего чата
  getCurrentChatId(): number | null {
    return Store.getCurrentChatId();
  }

  // Получить данные текущего чата
  getCurrentChat(): ChatData | null {
    return Store.getCurrentChat();
  }

  // Проверка загрузки
  isLoading(): boolean {
    return Store.get('chats.isLoading') as boolean;
  }

  // Получить ошибку
  getError(): string | null {
    return Store.get('chats.error') as string | null;
  }

  // Очистить ошибку
  clearError(): void {
    Store.clearChatError();
  }

  // Подписки на изменения
  onChatsChange(callback: (chats: ChatData[]) => void): () => void {
    return Store.onChatsChange(callback);
  }

  onMessagesChange(callback: (messages: MessageData[]) => void): () => void {
    return Store.onMessagesChange(callback);
  }

  onCurrentChatChange(callback: (chatId: number | null) => void): () => void {
    return Store.onCurrentChatChange(callback);
  }

  onLoadingChange(callback: (isLoading: boolean) => void): () => void {
    const handler = () => callback(Store.get('chats.isLoading') as boolean);
    Store.on('updated', handler);
    return () => Store.off('updated', handler);
  }

  onErrorChange(callback: (error: string | null) => void): () => void {
    const handler = () => callback(Store.get('chats.error') as string | null);
    Store.on('updated', handler);
    return () => Store.off('updated', handler);
  }
}

export default new ChatController();
