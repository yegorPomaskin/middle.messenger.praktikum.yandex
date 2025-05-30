import { API_BASE_URL } from '../config';

import { BaseAPI } from './baseAPI';
import HTTPTransport from './HTTPTransport';


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

export interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  avatar: string | null;
  role?: string;
  email?: string;
  phone?: string;
}

export interface CreateChatData {
  title: string;
}

export interface ChatUsersData {
  users: number[];
  chatId: number;
}

export interface CreateChatResponse {
  id: number;
}

class ChatAPI extends BaseAPI {
  private readonly http = new HTTPTransport();
  
  private readonly base = `${API_BASE_URL}/chats`;

  private async handle<T>(promise: Promise<XMLHttpRequest>, errorMsg: string): Promise<T> {
    const res = await promise;

    // Успешный ответ — без JSON
    if (res.status === 200 && res.responseText === 'OK') {
      return {} as T;
    }

    // Остальные случаи — парсим JSON
    const data = JSON.parse(res.responseText);

    if (res.status !== 200) {
      throw new Error(data.reason || errorMsg);
    }

    return data;
  }

  request(): Promise<ChatData[]> {
    return this.handle(this.http.get(this.base), 'Ошибка получения списка чатов');
  }

  create(data: CreateChatData): Promise<CreateChatResponse> {
    return this.handle(
      this.http.post(this.base, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка создания чата',
    );
  }

  addUsersToChat(data: ChatUsersData): Promise<void> {
    return this.handle(
      this.http.put(`${this.base}/users`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка добавления пользователей в чат',
    );
  }

  removeUsersFromChat(data: ChatUsersData): Promise<void> {
    return this.handle(
      this.http.delete(`${this.base}/users`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка удаления пользователей из чата',
    );
  }

  getChatUsers(chatId: number): Promise<ChatUser[]> {
    return this.handle(
      this.http.get(`${this.base}/${chatId}/users`),
      'Ошибка получения пользователей чата',
    );
  }

  getChatToken(chatId: number): Promise<{ token: string }> {
    return this.handle(
      this.http.post(`${this.base}/token/${chatId}`),
      'Ошибка получения токена чата',
    );
  }

  deleteChat(chatId: number): Promise<void> {
    return this.handle(
      this.http.delete(this.base, {
        data: { chatId },
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка удаления чата',
    );
  }

  getNewMessagesCount(chatId: number): Promise<{ unread_count: number }> {
    return this.handle(
      this.http.get(`${this.base}/${chatId}/new`),
      'Ошибка получения количества сообщений',
    );
  }
}

export default new ChatAPI();
