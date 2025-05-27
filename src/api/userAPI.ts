// src/api/UserAPI.ts
import HTTPTransport from './HTTPTransport';
import { BaseAPI } from './baseAPI';
import { UserData } from './authAPI';

// Типы данных для обновления профиля
export interface UpdateUserData {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

// Типы данных для смены пароля
export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Используем существующий HTTPTransport
const httpTransport = new HTTPTransport();

class UserAPI extends BaseAPI {
  private readonly baseUrl = 'https://ya-praktikum.tech/api/v2/user';

  // Обновление профиля пользователя
  async update(data: UpdateUserData): Promise<UserData> {
    const response = await httpTransport.put(`${this.baseUrl}/profile`, {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка обновления профиля');
    }

    return JSON.parse(response.responseText);
  }

  // Обновление пароля
  async updatePassword(data: UpdatePasswordData): Promise<void> {
    const response = await httpTransport.put(`${this.baseUrl}/password`, {
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка обновления пароля');
    }
  }

  // Обновление аватара
  async updateAvatar(file: File): Promise<UserData> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await httpTransport.put(`${this.baseUrl}/profile/avatar`, {
      data: formData,
      // Для FormData не устанавливаем Content-Type - браузер сам установит
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка обновления аватара');
    }

    return JSON.parse(response.responseText);
  }

  // Поиск пользователей (для чатов)
  async searchUsers(login: string): Promise<UserData[]> {
    const response = await httpTransport.post(`${this.baseUrl}/search`, {
      data: { login },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = JSON.parse(response.responseText);
      throw new Error(error.reason || 'Ошибка поиска пользователей');
    }

    return JSON.parse(response.responseText);
  }
}

// Экспортируем единственный экземпляр
export default new UserAPI();