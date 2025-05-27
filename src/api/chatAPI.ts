import HTTPTransport from './HTTPTransport';
import { BaseAPI } from './baseAPI';

// === ТИПЫ ДАННЫХ ===

// Данные чата
export interface ChatData {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      id: number;
      login: string;
      first_name: string;
      second_name: string;
    };
    time: string;
    content: string;
  } | null;
}

// Данные для создания чата
export interface CreateChatData {
  title: string;
}

// Данные для управления пользователями в чате
export interface ChatUsersData {
  users: number[]; // массив ID пользователей
  chatId: number;
}

// === API КЛАСС ===

class ChatAPI extends BaseAPI {
  private httpTransport: HTTPTransport;
  private readonly baseUrl = 'https://ya-praktikum.tech/api/v2/chats';

  constructor() {
    super();
    this.httpTransport = new HTTPTransport();
  }

  // === ОСНОВНЫЕ МЕТОДЫ ===

  // Список чатов пользователя (для отображения в UI)
  async request(): Promise<ChatData[]> {
    try {
      console.log('📋 Запрос списка чатов...');

      const response = await this.httpTransport.get(this.baseUrl);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения списка чатов');
      }

      const chats = JSON.parse(response.responseText);
      console.log('✅ Список чатов получен:', chats.length);

      return chats;
    } catch (error) {
      console.error('❌ Ошибка получения списка чатов:', error);
      throw error;
    }
  }

  // Создать новый чат
  async create(data: CreateChatData): Promise<{ id: number }> {
    try {
      console.log('➕ Создание чата:', data.title);

      const response = await this.httpTransport.post(this.baseUrl, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка создания чата');
      }

      const result = JSON.parse(response.responseText);
      console.log('✅ Чат создан с ID:', result.id);

      return result;
    } catch (error) {
      console.error('❌ Ошибка создания чата:', error);
      throw error;
    }
  }

  // Добавить пользователей в чат
  async addUsersToChat(data: ChatUsersData): Promise<void> {
    try {
      console.log('➕ Добавление пользователей в чат:', data.chatId, data.users);

      const response = await this.httpTransport.put(`${this.baseUrl}/users`, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка добавления пользователей в чат');
      }

      console.log('✅ Пользователи добавлены в чат');
    } catch (error) {
      console.error('❌ Ошибка добавления пользователей:', error);
      throw error;
    }
  }

  // Удалить пользователей из чата
  async removeUsersFromChat(data: ChatUsersData): Promise<void> {
    try {
      console.log('➖ Удаление пользователей из чата:', data.chatId, data.users);

      const response = await this.httpTransport.delete(`${this.baseUrl}/users`, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка удаления пользователей из чата');
      }

      console.log('✅ Пользователи удалены из чата');
    } catch (error) {
      console.error('❌ Ошибка удаления пользователей:', error);
      throw error;
    }
  }

  // Получить токен для WebSocket (понадобится для сообщений)
  async getChatToken(chatId: number): Promise<{ token: string }> {
    try {
      console.log('🔑 Получение токена для чата:', chatId);

      const response = await this.httpTransport.post(`${this.baseUrl}/token/${chatId}`);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения токена чата');
      }

      const result = JSON.parse(response.responseText);
      console.log('✅ Токен получен для чата:', chatId);

      return result;
    } catch (error) {
      console.error('❌ Ошибка получения токена чата:', error);
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр
export default new ChatAPI();