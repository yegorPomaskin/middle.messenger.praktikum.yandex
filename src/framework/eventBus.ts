export type EventCallback = (...args: any[]) => void;

export default class EventBus {
    private listeners: Record<string, EventCallback[]>

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
        const listeners = this.listeners[event]
        if (!listeners) {
            throw new Error(`Нет события: ${event}`);
        }

        this.listeners[event] = listeners.filter(
            listener => listener !== callback
        );
    }

    public emit(event: string, ...args: any[]):void {
        const listeners = this.listeners[event]
        if (!listeners) {
            throw new Error(`Нет события: ${event}`);
        }

        listeners.forEach((listener)=> listener(...args));
    }
}