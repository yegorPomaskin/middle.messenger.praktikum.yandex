import HTTPTransport from './HTTPTransport';
import { BaseAPI } from './baseAPI';
import { UserData } from './authAPI';

export interface UpdateUserData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

class UserAPI extends BaseAPI {
  private readonly base = 'https://ya-praktikum.tech/api/v2/user';
  private readonly http = new HTTPTransport();

  private async handle<T>(promise: Promise<XMLHttpRequest>, errorMsg: string): Promise<T> {
    const res = await promise;
    const isJSON = res.getResponseHeader('Content-Type')?.includes('application/json');
    const data = isJSON ? JSON.parse(res.responseText) : res.responseText;

    if (res.status !== 200) {
      throw new Error(data.reason || errorMsg);
    }

    return data;
  }

  update(data: UpdateUserData): Promise<UserData> {
    return this.handle(
      this.http.put(`${this.base}/profile`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка обновления профиля'
    );
  }

  updatePassword(data: UpdatePasswordData): Promise<void> {
    return this.handle(
      this.http.put(`${this.base}/password`, {
        data,
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка обновления пароля'
    );
  }

  updateAvatar(file: File): Promise<UserData> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.handle(
      this.http.put(`${this.base}/profile/avatar`, {
        data: formData,
        // Content-Type не указываем — браузер сам выставит
      }),
      'Ошибка обновления аватара'
    );
  }

  searchUsers(login: string): Promise<UserData[]> {
    return this.handle(
      this.http.post(`${this.base}/search`, {
        data: { login },
        headers: { 'Content-Type': 'application/json' },
      }),
      'Ошибка поиска пользователей'
    );
  }
}

export default new UserAPI();
