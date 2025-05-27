// src/api/chatAPI.ts (полная версия)
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

// Ответ при создании чата
export interface CreateChatResponse {
  id: number;
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

  // Список чатов пользователя
  async request(): Promise<ChatData[]> {
    try {
      console.log('📋 ChatAPI: Запрос списка чатов...');

      const response = await this.httpTransport.get(this.baseUrl);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения списка чатов');
      }

      const chats = JSON.parse(response.responseText);
      console.log('✅ ChatAPI: Список чатов получен:', chats.length);

      return chats;
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка получения списка чатов:', error);
      throw error;
    }
  }

  // Создать новый чат
  async create(data: CreateChatData): Promise<CreateChatResponse> {
    try {
      console.log('➕ ChatAPI: Создание чата с названием:', data.title);

      const response = await this.httpTransport.post(this.baseUrl, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 ChatAPI: Ответ сервера:', response.status, response.responseText);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка создания чата');
      }

      const result = JSON.parse(response.responseText);
      console.log('✅ ChatAPI: Чат создан с ID:', result.id);

      return result;
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка создания чата:', error);
      throw error;
    }
  }

  // === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===

  // Добавить пользователей в чат
  async addUsersToChat(data: ChatUsersData): Promise<void> {
    try {
      console.log('👥➕ ChatAPI: Добавление пользователей в чат:', data.chatId, data.users);

      const response = await this.httpTransport.put(`${this.baseUrl}/users`, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 ChatAPI: Ответ на добавление пользователей:', response.status, response.responseText);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка добавления пользователей в чат');
      }

      console.log('✅ ChatAPI: Пользователи добавлены в чат');
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка добавления пользователей:', error);
      throw error;
    }
  }

  // Удалить пользователей из чата
  async removeUsersFromChat(data: ChatUsersData): Promise<void> {
    try {
      console.log('👥➖ ChatAPI: Удаление пользователей из чата:', data.chatId, data.users);

      const response = await this.httpTransport.delete(`${this.baseUrl}/users`, {
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 ChatAPI: Ответ на удаление пользователей:', response.status, response.responseText);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка удаления пользователей из чата');
      }

      console.log('✅ ChatAPI: Пользователи удалены из чата');
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка удаления пользователей:', error);
      throw error;
    }
  }

  // Получить пользователей чата
  async getChatUsers(chatId: number): Promise<any[]> {
    try {
      console.log('👥 ChatAPI: Получение пользователей чата:', chatId);

      const response = await this.httpTransport.get(`${this.baseUrl}/${chatId}/users`);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения пользователей чата');
      }

      const users = JSON.parse(response.responseText);
      console.log('✅ ChatAPI: Пользователи чата получены:', users.length);

      return users;
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка получения пользователей чата:', error);
      throw error;
    }
  }

  // === ТОКЕНЫ ДЛЯ WEBSOCKET ===

  // Получить токен для подключения к WebSocket
  async getChatToken(chatId: number): Promise<{ token: string }> {
    try {
      console.log('🔑 ChatAPI: Получение токена для чата:', chatId);

      const response = await this.httpTransport.post(`${this.baseUrl}/token/${chatId}`);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения токена чата');
      }

      const result = JSON.parse(response.responseText);
      console.log('✅ ChatAPI: Токен получен для чата:', chatId);

      return result;
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка получения токена чата:', error);
      throw error;
    }
  }

  // === ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ===

  // Удалить чат
  async deleteChat(chatId: number): Promise<void> {
    try {
      console.log('🗑️ ChatAPI: Удаление чата:', chatId);

      const response = await this.httpTransport.delete(this.baseUrl, {
        data: { chatId },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка удаления чата');
      }

      console.log('✅ ChatAPI: Чат удален');
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка удаления чата:', error);
      throw error;
    }
  }

  // Получить количество непрочитанных сообщений
  async getNewMessagesCount(chatId: number): Promise<{ unread_count: number }> {
    try {
      console.log('📊 ChatAPI: Получение количества непрочитанных сообщений:', chatId);

      const response = await this.httpTransport.get(`${this.baseUrl}/${chatId}/new`);

      if (response.status !== 200) {
        const error = JSON.parse(response.responseText);
        throw new Error(error.reason || 'Ошибка получения количества сообщений');
      }

      const result = JSON.parse(response.responseText);
      console.log('✅ ChatAPI: Количество непрочитанных сообщений:', result.unread_count);

      return result;
    } catch (error) {
      console.error('❌ ChatAPI: Ошибка получения количества сообщений:', error);
      throw error;
    }
  }
}

// Экспортируем единственный экземпляр
export default new ChatAPI();