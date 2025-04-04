// Перечисление доступных HTTP методов
export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface RequestOptions {
  headers?: Record<string, string>;
  method?: METHODS;
  data?: unknown;
  timeout?: number;
}

/**
 * Преобразует объект в строку запроса
 * @param {Record<string, unknown>} data - Объект для преобразования
 * @returns {string} - Строка запроса
 */
function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    return '';
  }

  return keys.reduce((result, key, index) => {
    let value = data[key];

    // Преобразование значений в строку
    if (Array.isArray(value)) {
      value = value.join(',');
    } else if (typeof value === 'object' && value !== null) {
      value = JSON.stringify(value);
    }

    return `${result}${key}=${encodeURIComponent(String(value))}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

export default class HTTPTransport {
  /**
   * GET-запрос
   * @param {string} url - URL запроса
   * @param {RequestOptions} options - Опции запроса
   * @returns {Promise<XMLHttpRequest>} - Promise с объектом XMLHttpRequest
   */
  public get(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.GET }, options.timeout);
  }

  /**
   * POST-запрос
   * @param {string} url - URL запроса
   * @param {RequestOptions} options - Опции запроса
   * @returns {Promise<XMLHttpRequest>} - Promise с объектом XMLHttpRequest
   */
  public post(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
  }

  /**
   * PUT-запрос
   * @param {string} url - URL запроса
   * @param {RequestOptions} options - Опции запроса
   * @returns {Promise<XMLHttpRequest>} - Promise с объектом XMLHttpRequest
   */
  public put(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
  }

  /**
   * DELETE-запрос
   * @param {string} url - URL запроса
   * @param {RequestOptions} options - Опции запроса
   * @returns {Promise<XMLHttpRequest>} - Promise с объектом XMLHttpRequest
   */
  public delete(url: string, options: RequestOptions = {}): Promise<XMLHttpRequest> {
    return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
  }

  /**
   * Основной метод для выполнения запросов
   * @param {string} url - URL запроса
   * @param {RequestOptions} options - Опции запроса
   * @param {number} timeout - Таймаут запроса
   * @returns {Promise<XMLHttpRequest>} - Promise с объектом XMLHttpRequest
   */
  private request(
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000,
  ): Promise<XMLHttpRequest> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method specified'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      // Для GET-запроса добавляем параметры в URL
      xhr.open(
        method,
        isGet && !!data ? `${url}${queryStringify(data as Record<string, unknown>)}` : url,
      );

      // Установка заголовков
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      // Обработчики событий
      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timed out'));

      xhr.timeout = timeout;

      // Отправка запроса
      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(data instanceof FormData ? data : JSON.stringify(data));
      }
    });
  }
}
