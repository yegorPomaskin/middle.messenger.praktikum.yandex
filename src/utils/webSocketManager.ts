import ChatAPI from '../api/chatAPI';
import AuthController from '../controllers/AuthController';

export interface MessageData {
  id?: string;
  user_id: string;
  content: string;
  time: string;
  type?: 'message' | 'file' | 'sticker' | string;
}

type MessageHandler = (msg: MessageData) => void;
type HistoryHandler = (msgs: MessageData[]) => void;
type UserConnectHandler = (userId: string) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private userId: number | null = null;
  private chatId: number | null = null;

  private onMessageCallback?: MessageHandler;
  private onHistoryCallback?: HistoryHandler;
  private onUserConnectedCallback?: UserConnectHandler;

  async connect(
    chatId: number,
    handlers?: {
      onMessage?: MessageHandler;
      onHistory?: HistoryHandler;
      onUserConnected?: UserConnectHandler;
    }
  ): Promise<void> {
    const user = AuthController.getUserData();
    this.userId = user?.id || null;
    this.chatId = chatId;

    const { token } = await ChatAPI.getChatToken(chatId);
    if (!this.userId || !token) throw new Error('Нет userId или token');

    const url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${chatId}/${token}`;
    this.socket = new WebSocket(url);

    this.onMessageCallback = handlers?.onMessage;
    this.onHistoryCallback = handlers?.onHistory;
    this.onUserConnectedCallback = handlers?.onUserConnected;

    await new Promise<void>((resolve, reject) => {
      if (!this.socket) return reject(new Error('Нет WebSocket'));
      this.socket.addEventListener('open', () => {
        this.send({ content: '0', type: 'get old' });
        resolve();
      });
      this.socket.addEventListener('error', (e) => {
        console.error('WebSocket error:', e);
        reject(e);
      });
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        this.onHistoryCallback?.(data);
      } else if (data.type === 'message') {
        this.onMessageCallback?.(data);
      } else if (data.type === 'user connected') {
        this.onUserConnectedCallback?.(data.content);
      }
    });

    this.socket.addEventListener('close', () => {
      console.warn('WebSocket закрыт');
    });
  }

  async connectWithCookies(
    chatId: number,
    handlers?: {
      onMessage?: MessageHandler;
      onHistory?: HistoryHandler;
      onUserConnected?: UserConnectHandler;
    }
  ): Promise<void> {
    const { token } = await ChatAPI.getChatToken(chatId);
    const user = AuthController.getUserData();
    this.userId = user?.id || null;
    this.chatId = chatId;

    if (!this.userId || !token) throw new Error('Нет userId или token');

    const url = `wss://ya-praktikum.tech/ws/chats/${this.userId}/${chatId}/${token}`;
    this.socket = new WebSocket(url);

    this.onMessageCallback = handlers?.onMessage;
    this.onHistoryCallback = handlers?.onHistory;
    this.onUserConnectedCallback = handlers?.onUserConnected;

    await new Promise<void>((resolve, reject) => {
      if (!this.socket) return reject(new Error('Нет WebSocket'));
      this.socket.addEventListener('open', () => {
        this.send({ content: '0', type: 'get old' });
        resolve();
      });
      this.socket.addEventListener('error', (e) => {
        console.error('WebSocket error (cookies):', e);
        reject(e);
      });
    });

    this.socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        this.onHistoryCallback?.(data);
      } else if (data.type === 'message') {
        this.onMessageCallback?.(data);
      } else if (data.type === 'user connected') {
        this.onUserConnectedCallback?.(data.content);
      }
    });

    this.socket.addEventListener('close', () => {
      console.warn('WebSocket закрыт (cookies)');
    });
  }

  public sendMessage(content: string): void {
    this.send({ content, type: 'message' });
  }

  public getOldMessages(offset = 0): void {
    this.send({ content: String(offset), type: 'get old' });
  }

  private send(data: Record<string, unknown>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket не подключён');
    }
    this.socket.send(JSON.stringify(data));
  }

  public disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.chatId = null;
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketManager();
