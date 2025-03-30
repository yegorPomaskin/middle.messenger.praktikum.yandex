import Block from "../framework/block";
import template from "../templates/chat.hbs?raw";
import styles from "../styles/pages/chat.module.css";
import { ChatItem, ChatItemProps } from "../components/chatItem/chatItem";
import { ChatInterface, Message } from "../components/chatInterface/chatInterface";

console.log('ChatPage styles imported:', styles);
console.log('Object.keys(styles):', Object.keys(styles));

interface ChatPageProps {
  activeChatId?: number;
  attachment: string;
  sendButton: string;
}

export class ChatPage extends Block {
  constructor(props: ChatPageProps) {
    // Подготовка данных чатов
    const chatsData = [
      {
        id: 1,
        name: "Андрей",
        avatar: "/avatar.png",
        lastMessage: "Привет!",
        time: "10:49",
        unreadCount: 2,
        isActive: props.activeChatId === 1,
      },
      {
        id: 2,
        name: "Виктор",
        avatar: "/avatar.png",
        lastMessage: "Как дела?",
        time: "10:52",
        unreadCount: 0,
        isActive: props.activeChatId === 2,
      },
      {
        id: 3,
        name: "Лешка",
        avatar: "/avatar.png",
        lastMessage: "Как дела?",
        time: "10:52",
        unreadCount: 0,
        isActive: props.activeChatId === 3,
      },
    ];

    // Сообщения для активного чата
    const messages: Message[] = [
      { userName: "Андрей", time: "10:49", text: "Привет, как дела?" },
      { userName: "Виктор", time: "10:52", text: "Все хорошо, а у тебя?" },
    ];

    // Создаем компоненты для каждого чата
    const chatItems = chatsData.map(chatData => 
      new ChatItem({
        ...chatData,
        events: {
          click: (e: Event) => {
            e.preventDefault();
            console.log(`Чат ${chatData.id} выбран`);
            this.setActiveChat(chatData.id);
          }
        }
      })
    );

    // Создаем компонент интерфейса чата
    const chatInterface = new ChatInterface({
      messages,
      attachment: props.attachment,
      sendButton: props.sendButton,
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.querySelector('input');
          if (input && input.value.trim()) {
            console.log(`Отправлено сообщение: ${input.value}`);
            this.sendMessage(input.value);
            input.value = '';
          }
        }
      }
    });

    super({
      ...props,
      chatItems,
      chatInterface,
      styles,
    });
  }

  // Метод для изменения активного чата
  public setActiveChat(chatId: number): void {
    // Обновляем свойства компонента
    this.setProps({ activeChatId: chatId });
    
    // Обновляем состояние каждого чата в списке
    if (this.lists && this.lists.chatItems) {
      this.lists.chatItems.forEach((item: any) => {
        if (item instanceof ChatItem) {
          // Используем интерфейс вместо прямого доступа к защищенным свойствам
          item.setProps({ 
            isActive: item.getId() === chatId 
          });
        }
      });
    }
    
    // Здесь также можно добавить логику для загрузки сообщений выбранного чата
    // и обновления компонента chatInterface
  }

  // Метод для отправки сообщения
  private sendMessage(text: string): void {
    if (!text.trim()) return;
    
    const newMessage: Message = {
      userName: "Вы", // или имя текущего пользователя
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };
    
    // Добавляем сообщение в интерфейс чата
    if (this.children && this.children.chatInterface) {
      const chatInterface = this.children.chatInterface as ChatInterface;
      
      // Получаем текущие сообщения безопасным способом
      const currentMessages = [...(chatInterface.getMessage() || [])];
      currentMessages.push(newMessage);
      
      chatInterface.setProps({
        messages: currentMessages
      });
    }
  }

  protected render(): string {
    return template;
  }
}
