import Handlebars from 'handlebars';

import AuthController from '../../controllers/AuthController';
import Block, { BlockProps } from '../../framework/block';
import WebSocketManager, { MessageData } from '../../utils/webSocketManager';

import template from './chatInterface.hbs?raw';
import styles from './chatInterface.module.css';

export interface Message {
  id?: string;
  userName: string;
  time: string;
  text: string;
  userId: string;
  type: 'message' | 'file' | 'sticker';
  isOwn: boolean;
}

export interface ChatInterfaceProps extends BlockProps {
  messages?: Message[];
  attachment: string;
  sendButton: string;
  chatId?: number;
  events?: Record<string, (e: Event) => void>;
  styles?: Record<string, string>;
}

export class ChatInterface extends Block<ChatInterfaceProps> {
  private currentChatId: number | null = null;

  private messagesData: Message[] = [];

  private currentUserId: string | null = null;

  private isInternalUpdate = false;

  constructor(props: ChatInterfaceProps) {
    super({
      ...props,
      styles,
      messages: props.messages || [],
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          this.handleSendMessage();
        },
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (
            target.classList.contains('chat__interface-sendButton') ||
            target.closest('.chat__interface-sendButton')
          ) {
            e.preventDefault();
            this.handleSendMessage();
          }
        },
      },
    });

    Handlebars.registerHelper('eq', (a, b) => a === b);

    this.messagesData = props.messages || [];
    const currentUser = AuthController.getUserData();
    this.currentUserId = currentUser ? currentUser.id.toString() : null;
  }

  protected componentDidUpdate(): boolean {
    if (this.isInternalUpdate) {
      this.isInternalUpdate = false;
      return true;
    }
    return false;
  }

  async connectToChat(chatId: number): Promise<void> {
    const currentUser = AuthController.getUserData();
    if (!currentUser) throw new Error('Пользователь не авторизован');

    this.currentUserId = currentUser.id.toString();
    if (this.currentChatId === chatId && WebSocketManager.isConnected()) return;

    this.currentChatId = chatId;
    this.messagesData = [];
    this.updateMessages();
    this.addSystemMessage('Подключение к чату...');

    try {
      await WebSocketManager.connect(chatId, {
        onMessage: (msg) => this.addMessage(msg),
        onHistory: (msgs) => this.loadMessagesHistory(msgs),
        onUserConnected: (userId) =>
          this.addSystemMessage(`Пользователь ${userId} подключился к чату`),
      });
    } catch {
      await WebSocketManager.connectWithCookies(chatId);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!WebSocketManager.isConnected()) {
      this.addSystemMessage('❌ Не удалось установить WebSocket соединение');
      throw new Error('Не удалось установить WebSocket соединение');
    }

    this.clearSystemMessages();
    this.addSystemMessage('✅ Подключено к чату');
    setTimeout(() => {
      if (WebSocketManager.isConnected()) {
        this.addSystemMessage('Загрузка истории сообщений...');
        WebSocketManager.getOldMessages(0);
      }
    }, 1000);
  }

  disconnectFromChat(): void {
    WebSocketManager.disconnect();
    this.currentChatId = null;
    this.messagesData = [];
    this.updateMessages();
  }

  private handleSendMessage(): void {
    const input = this.element?.querySelector('input[name="message"]') as HTMLInputElement;
    if (!input) return;

    const messageText = input.value.trim();
    if (!messageText) return;

    if (!WebSocketManager.isConnected()) {
      this.addSystemMessage('❌ Соединение потеряно. Переподключитесь к чату.');
      return;
    }
    if (!this.currentChatId) {
      this.addSystemMessage('❌ Выберите чат для отправки сообщения');
      return;
    }
    try {
      WebSocketManager.sendMessage(messageText);
      input.value = '';
    } catch {
      this.addSystemMessage('❌ Ошибка отправки сообщения');
    }
  }

  private addMessage(messageData: MessageData): void {
    const type: 'message' | 'file' | 'sticker' =
      messageData.type === 'file' || messageData.type === 'sticker' ? messageData.type : 'message';

    const message: Message = {
      id: messageData.id || `msg-${Date.now()}`,
      userName: this.getUserName(messageData.user_id),
      time: this.formatTime(messageData.time),
      text: messageData.content,
      userId: messageData.user_id,
      type,
      isOwn: messageData.user_id === this.currentUserId,
    };

    this.messagesData.push(message);
    this.updateMessages();
    this.scrollToBottom();
  }

  private loadMessagesHistory(messages: MessageData[]): void {
    if (!messages.length) {
      this.addSystemMessage('История сообщений пуста. Напишите первое сообщение!');
      return;
    }
    const history: Message[] = messages.map((m) => ({
      id: m.id,
      userName: this.getUserName(m.user_id),
      time: this.formatTime(m.time),
      text: m.content,
      userId: m.user_id,
      type: m.type === 'file' || m.type === 'sticker' ? m.type : 'message',
      isOwn: m.user_id === this.currentUserId,
    }));
    this.messagesData = [...history.reverse()];
    this.updateMessages();
    this.scrollToBottom();
  }

  private addSystemMessage(text: string): void {
    this.messagesData.push({
      id: `system-${Date.now()}`,
      userName: 'Система',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      text,
      userId: 'system',
      type: 'message',
      isOwn: false,
    });
    this.updateMessages();
    this.scrollToBottom();
  }

  private clearSystemMessages(): void {
    this.messagesData = this.messagesData.filter((msg) => msg.userId !== 'system');
    this.updateMessages();
  }

  private updateMessages(): void {
    this.isInternalUpdate = true;
    this.setProps({ messages: [...this.messagesData] });
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const messagesContainer = this.element?.querySelector('.chat__messages');
        if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    });
  }

  private getUserName(userId: string): string {
    if (userId === this.currentUserId) return 'Вы';
    if (userId === 'system') return 'Система';
    return `Пользователь ${userId}`;
  }

  private formatTime(timeString: string): string {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeString;
    }
  }

  protected render(): string {
    const messagesForTemplate = (this.props.messages as Message[]) || [];
    return Handlebars.compile(template)({ ...this.props, messages: messagesForTemplate, styles });
  }

  async setActiveChat(chatId: number): Promise<void> {
    if (this.currentChatId !== chatId) {
      await this.connectToChat(chatId);
    }
  }

  public getMessages(): Message[] {
    return this.messagesData;
  }

  public clearMessages(): void {
    this.messagesData = [];
    this.updateMessages();
  }

  public isConnected(): boolean {
    return WebSocketManager.isConnected();
  }

  public getCurrentChatId(): number | null {
    return this.currentChatId;
  }
}
