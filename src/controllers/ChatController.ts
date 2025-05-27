// src/controllers/ChatController.ts (полная версия)
import ChatAPI, { CreateChatData, ChatData, ChatUsersData } from '../api/chatAPI';
import Store from '../store/store';

class ChatController {

  // === ЗАГРУЗКА ДАННЫХ ===

  // Загрузить список чатов пользователя
  async loadChats(): Promise<void> {
    try {
      console.log('💬 ChatController: Загрузка списка чатов...');
      
      // Устанавливаем состояние загрузки
      Store.setChatLoading(true);
      Store.clearChatError();
      
      // Запрашиваем данные через API
      const chats = await ChatAPI.request();
      
      // Сохраняем в Store
      Store.setChats(chats);
      
      console.log('✅ ChatController: Чаты загружены и сохранены в Store:', chats.length);
      
    } catch (error) {
      console.error('❌ ChatController: Ошибка загрузки чатов:', error);
      
      // Сохраняем ошибку в Store
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки чатов';
      Store.setChatError(errorMessage);
      
      throw error;
    } finally {
      // Убираем индикатор загрузки
      Store.setChatLoading(false);
    }
  }

  // === УПРАВЛЕНИЕ ЧАТАМИ ===

  // Создать новый чат
  async createChat(title: string): Promise<void> {
    try {
      console.log('➕ ChatController: Создание нового чата:', title);
      
      // Валидация
      if (!title || !title.trim()) {
        throw new Error('Название чата не может быть пустым');
      }

      if (title.trim().length < 2) {
        throw new Error('Название чата должно содержать минимум 2 символа');
      }

      Store.setChatLoading(true);
      Store.clearChatError();
      
      // Создаем чат через API
      const result = await ChatAPI.create({ title: title.trim() });
      
      console.log('✅ ChatController: Чат создан с ID:', result.id);
      
      // Перезагружаем список чатов чтобы увидеть новый
      await this.loadChats();
      
    } catch (error) {
      console.error('❌ ChatController: Ошибка создания чата:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания чата';
      Store.setChatError(errorMessage);
      
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Удалить чат
  async deleteChat(chatId: number): Promise<void> {
    try {
      console.log('🗑️ ChatController: Удаление чата:', chatId);

      Store.setChatLoading(true);
      Store.clearChatError();

      // Удаляем чат через API
      await ChatAPI.deleteChat(chatId);

      console.log('✅ ChatController: Чат удален');

      // Перезагружаем список чатов
      await this.loadChats();

    } catch (error) {
      console.error('❌ ChatController: Ошибка удаления чата:', error);

      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления чата';
      Store.setChatError(errorMessage);

      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===

  // Добавить пользователей в чат
  async addUsersToChat(chatId: number, userIds: number[]): Promise<void> {
    try {
      console.log('👥➕ ChatController: Добавление пользователей в чат:', chatId, userIds);
      
      // Валидация
      if (!userIds || userIds.length === 0) {
        throw new Error('Необходимо указать пользователей для добавления');
      }

      Store.setChatLoading(true);
      Store.clearChatError();
      
      // Добавляем через API
      await ChatAPI.addUsersToChat({
        chatId,
        users: userIds,
      });
      
      console.log('✅ ChatController: Пользователи добавлены в чат');
      
    } catch (error) {
      console.error('❌ ChatController: Ошибка добавления пользователей:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления пользователей';
      Store.setChatError(errorMessage);
      
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Удалить пользователей из чата
  async removeUsersFromChat(chatId: number, userIds: number[]): Promise<void> {
    try {
      console.log('👥➖ ChatController: Удаление пользователей из чата:', chatId, userIds);
      
      // Валидация
      if (!userIds || userIds.length === 0) {
        throw new Error('Необходимо указать пользователей для удаления');
      }

      Store.setChatLoading(true);
      Store.clearChatError();
      
      // Удаляем через API
      await ChatAPI.removeUsersFromChat({
        chatId,
        users: userIds,
      });
      
      console.log('✅ ChatController: Пользователи удалены из чата');
      
    } catch (error) {
      console.error('❌ ChatController: Ошибка удаления пользователей:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления пользователей';
      Store.setChatError(errorMessage);
      
      throw error;
    } finally {
      Store.setChatLoading(false);
    }
  }

  // Получить пользователей чата
  async getChatUsers(chatId: number): Promise<any[]> {
    try {
      console.log('👥 ChatController: Получение пользователей чата:', chatId);

      const users = await ChatAPI.getChatUsers(chatId);

      console.log('✅ ChatController: Пользователи чата получены:', users.length);

      return users;

    } catch (error) {
      console.error('❌ ChatController: Ошибка получения пользователей чата:', error);

      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения пользователей';
      Store.setChatError(errorMessage);

      throw error;
    }
  }

  // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ===

  // Получить токен для подключения к WebSocket
  async getChatToken(chatId: number): Promise<string> {
    try {
      console.log('🔑 ChatController: Получение токена для чата:', chatId);
      
      const result = await ChatAPI.getChatToken(chatId);
      
      console.log('✅ ChatController: Токен получен для чата:', chatId);
      
      return result.token;
      
    } catch (error) {
      console.error('❌ ChatController: Ошибка получения токена:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка получения токена';
      Store.setChatError(errorMessage);
      
      throw error;
    }
  }

  // Получить количество непрочитанных сообщений
  async getNewMessagesCount(chatId: number): Promise<number> {
    try {
      console.log('📊 ChatController: Получение количества непрочитанных сообщений:', chatId);

      const result = await ChatAPI.getNewMessagesCount(chatId);

      console.log('✅ ChatController: Количество непрочитанных сообщений:', result.unread_count);

      return result.unread_count;

    } catch (error) {
      console.error('❌ ChatController: Ошибка получения количества сообщений:', error);
      return 0;
    }
  }

  // === ИНТЕГРАЦИЯ С WEBSOCKET ===

  // Обработка нового сообщения из WebSocket
  handleNewMessage(message: any): void {
    console.log('💬 ChatController: Новое сообщение через WebSocket:', message);
    
    // Добавляем сообщение в Store
    Store.addMessage(message);
  }

  // Обработка истории сообщений из WebSocket
  handleMessagesHistory(messages: any[]): void {
    console.log('📜 ChatController: История сообщений через WebSocket:', messages.length);
    
    // Добавляем историю в Store
    Store.addMessagesHistory(messages);
  }

  // === МЕТОДЫ ДЛЯ UI ===

  // Установить активный чат
  setActiveChat(chatId: number | null): void {
    console.log('🎯 ChatController: Установка активного чата:', chatId);
    Store.setCurrentChat(chatId);
  }

  // Получить данные из Store для UI
  getChats(): ChatData[] {
    return Store.getChats();
  }

  getCurrentChatId(): number | null {
    return Store.getCurrentChatId();
  }

  getCurrentChat(): ChatData | null {
    return Store.getCurrentChat();
  }

  isLoading(): boolean {
    return Store.get('chats.isLoading') as boolean;
  }

  getError(): string | null {
    return Store.get('chats.error') as string | null;
  }

  // Очистить ошибки
  clearError(): void {
    Store.clearChatError();
  }

  // === ПОДПИСКИ НА ИЗМЕНЕНИЯ (для UI компонентов) ===

  // Подписаться на изменения списка чатов
  onChatsChange(callback: (chats: ChatData[]) => void): () => void {
    return Store.onChatsChange(callback);
  }

  // Подписаться на изменения активного чата
  onCurrentChatChange(callback: (chatId: number | null) => void): () => void {
    return Store.onCurrentChatChange(callback);
  }

  // Подписаться на изменения состояния загрузки
  onLoadingChange(callback: (isLoading: boolean) => void): () => void {
    const handler = () => {
      const isLoading = Store.get('chats.isLoading') as boolean;
      callback(isLoading);
    };

    Store.on('updated', handler);

    // Возвращаем функцию отписки
    return () => {
      Store.off('updated', handler);
    };
  }

  // Подписаться на ошибки
  onErrorChange(callback: (error: string | null) => void): () => void {
    const handler = () => {
      const error = Store.get('chats.error') as string | null;
      callback(error);
    };

    Store.on('updated', handler);

    return () => {
      Store.off('updated', handler);
    };
  }
}

// Экспортируем единственный экземпляр
export default new ChatController();