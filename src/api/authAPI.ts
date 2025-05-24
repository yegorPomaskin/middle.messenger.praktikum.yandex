// src/api/AuthAPI.ts
import HTTPTransport from './HTTPTransport';
import { BaseAPI } from './baseAPI';

// Типы данных для запросов
export interface SignInData {
  login: string;
  password: string;
}

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

// Тип данных пользователя
export interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

// Используем существующий HTTPTransport
const httpTransport = new HTTPTransport();

class AuthAPI extends BaseAPI {
  private readonly baseUrl = 'https://ya-praktikum.tech/api/v2/auth';

  // Регистрация нового пользователя
  async create(data: SignUpData): Promise<UserData> {
    const response = await httpTransport.post(`${this.baseUrl}/signup`, {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка регистрации');
    }

    return JSON.parse(response.responseText);
  }

  // Авторизация пользователя
  async signIn(data: SignInData): Promise<void> {
    const response = await httpTransport.post(`${this.baseUrl}/signin`, {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка авторизации');
    }
  }

  // Получение информации о текущем пользователе
  async request(): Promise<UserData> {
    const response = await httpTransport.get(`${this.baseUrl}/user`);

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Пользователь не авторизован');
    }

    return JSON.parse(response.responseText);
  }

  // Выход из системы
  async logout(): Promise<void> {
    const response = await httpTransport.post(`${this.baseUrl}/logout`);

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка при выходе');
    }
  }
}

// Экспортируем единственный экземпляр
export default new AuthAPI();
