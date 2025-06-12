export type EventCallback<T extends unknown[] = unknown[]> = (...args: T) => void;

export default class EventBus {
  private listeners: Record<string, EventCallback[]>;

  constructor() {
    this.listeners = {};
  }

  // Регистрация событий
  public on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  // Удаление событий
  public off(event: string, callback: EventCallback): void {
    const listeners = this.listeners[event];
    if (!listeners) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = listeners.filter((listener) => listener !== callback);
  }

  public emit<T extends unknown[] = unknown[]>(event: string, ...args: T): void {
    const listeners = this.listeners[event];
    if (!listeners || listeners.length === 0) {
      return; // Просто выходим, не выбрасываем ошибку
    }
    listeners.forEach((listener) => listener(...args));
  }
}
