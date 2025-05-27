// src/utils/webSocketManager.ts
import ChatController from '../controllers/ChatController';
import AuthController from '../controllers/AuthController';

export interface MessageData {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: 'message' | 'file' | 'sticker';
  chat_id?: number;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

export interface WebSocketMessage {
  content: string;
  type: 'message' | 'file' | 'sticker' | 'get old' | 'ping' | 'pong' | 'user connected';
}

class WebSocketManager {
  private socket: WebSocket | null = null;
  private chatId: number | null = null;
  private userId: number | null = null;
  private token: string | null = null;
  private pingInterval: number | null = null;
  private onMessageCallback?: (message: MessageData) => void;
  private onHistoryCallback?: (messages: MessageData[]) => void;
  private onUserConnectedCallback?: (userId: string) => void;

  // Подключение к чату с токеном
  async connect(chatId: number): Promise<void> {
    try {
      const currentUser = AuthController.getUserData();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }

      this.userId = currentUser.id;

      if (this.socket) {
        this.disconnect();
      }

      this.chatId = chatId;

      try {
        this.token = await ChatController.getChatToken(chatId);
      } catch (tokenError) {
        throw new Error('Не удалось получить токен для чата');
      }

      const wsUrl = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${chatId}/${this.token}`;
      this.socket = new WebSocket(wsUrl);

      this.setupEventHandlers();
      await this.waitForConnection();
      this.startPing();

    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  // Альтернативное подключение с куки
  async connectWithCookies(chatId: number): Promise<void> {
    try {
      const currentUser = AuthController.getUserData();
      if (!currentUser) {
        throw new Error('Пользователь не авторизован');
      }

      if (this.socket) {
        this.disconnect();
      }

      this.chatId = chatId;
      this.userId = currentUser.id;

      const wsUrl = `wss://ya-praktikum.tech/ws/chats/${chatId}/`;
      this.socket = new WebSocket(wsUrl);

      this.setupEventHandlers();
      await this.waitForConnection();
      this.startPing();

    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket не инициализирован'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Timeout подключения к WebSocket'));
      }, 15000);

      this.socket.onopen = () => {
        clearTimeout(timeout);
        resolve();
      };

      this.socket.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Ошибка WebSocket подключения'));
      };
    });
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Ошибка парсинга WebSocket сообщения:', error);
      }
    };

    this.socket.onclose = () => {
      this.stopPing();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }

  private handleMessage(data: any): void {
    if (Array.isArray(data)) {
      if (this.onHistoryCallback) {
        this.onHistoryCallback(data as MessageData[]);
      }
      return;
    }

    switch (data.type) {
      case 'message':
      case 'file':
      case 'sticker':
        if (this.onMessageCallback) {
          this.onMessageCallback(data as MessageData);
        }
        break;

      case 'user connected':
        if (this.onUserConnectedCallback) {
          this.onUserConnectedCallback(data.content);
        }
        break;

      case 'pong':
        // Pong обработан
        break;

      default:
        console.log('Неизвестное WebSocket сообщение:', data);
    }
  }

  sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket соединение не активно');
    }

    const message: WebSocketMessage = {
      content,
      type: 'message'
    };

    this.socket.send(JSON.stringify(message));
  }

  getOldMessages(offset: number = 0): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket не подключен для запроса истории');
      return;
    }

    const message: WebSocketMessage = {
      content: offset.toString(),
      type: 'get old'
    };

    this.socket.send(JSON.stringify(message));
  }

  private startPing(): void {
    this.pingInterval = window.setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const pingMessage: WebSocketMessage = {
          content: '',
          type: 'ping'
        };
        
        this.socket.send(JSON.stringify(pingMessage));
      } else {
        this.stopPing();
      }
    }, 25000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private cleanup(): void {
    this.stopPing();
    this.chatId = null;
    this.userId = null;
    this.token = null;
  }

  disconnect(): void {
    this.cleanup();

    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.close(1000, 'Client disconnecting');
      }
      this.socket = null;
    }
  }

  // Колбэки
  onMessage(callback: (message: MessageData) => void): void {
    this.onMessageCallback = callback;
  }

  onHistory(callback: (messages: MessageData[]) => void): void {
    this.onHistoryCallback = callback;
  }

  onUserConnected(callback: (userId: string) => void): void {
    this.onUserConnectedCallback = callback;
  }

  // Геттеры
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  getCurrentChatId(): number | null {
    return this.chatId;
  }

  getConnectionState(): string {
    if (!this.socket) return 'NOT_INITIALIZED';
    
    switch (this.socket.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
}

export default new WebSocketManager();