import { API_BASE_URL } from '../config';

import { BaseAPI } from './baseAPI';
import HTTPTransport from './HTTPTransport';

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

class AuthAPI extends BaseAPI {
  private readonly base = `${API_BASE_URL}/auth`;

  private readonly http = new HTTPTransport();

  private async handle<T>(promise: Promise<XMLHttpRequest>, errorMsg: string): Promise<T> {
    const res = await promise;
    const contentType = res.getResponseHeader('Content-Type');

    const isJSON = contentType?.includes('application/json');
    const data = isJSON ? JSON.parse(res.responseText) : res.responseText;

    if (res.status !== 200) {
      throw new Error(data.reason || errorMsg);
    }

    return data;
  }

  create(data: SignUpData): Promise<UserData> {
    return this.handle(
      this.http.post(`${this.base}/signup`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка регистрации',
    );
  }

  signIn(data: SignInData): Promise<void> {
    return this.handle(
      this.http.post(`${this.base}/signin`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка авторизации',
    );
  }

  request(): Promise<UserData> {
    return this.handle(this.http.get(`${this.base}/user`), 'Пользователь не авторизован');
  }

  logout(): Promise<void> {
    return this.handle(this.http.post(`${this.base}/logout`), 'Ошибка при выходе');
  }
}

export default new AuthAPI();
