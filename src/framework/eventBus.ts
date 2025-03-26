type EventCallback = (...args: any[]) => void;

class EventBus {
    private listeners: Record<string, EventCallback[]>

    constructor() {
        this.listeners = {};
    }

    // Регистрация событий
    on(event: string, callback: EventCallback): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(callback);
    }

    // Удаление событий
    off(event: string, callback: EventCallback): void {
        const listeners = this.listeners[event]
        if (!listeners) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = listeners.filter(
            listener => listener !== callback
        );
    }

    emit(event: string, ...args: any[]) {
        const listeners = this.listeners[event]
        if (!listeners) {
            throw new Error(`Нет события: ${event}`);
        }

        listeners.forEach((listener)=> listener(...args));
    }
}