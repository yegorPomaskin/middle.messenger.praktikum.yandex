import Block from "../../framework/block";
import template from "./ChatInterface.hbs?raw";
import styles from "./ChatInterface.module.css";

// Интерфейс BlockProps для совместимости с Block
interface BlockProps {
  [key: string]: any;
  events?: Record<string, (e: Event) => void>;
}

export interface Message {
  userName: string;
  time: string;
  text: string;
}

export interface ChatInterfaceProps extends BlockProps {
  messages: Message[];
  attachment: string;
  sendButton: string;
}

export class ChatInterface extends Block {
  constructor(props: ChatInterfaceProps) {
    super({
      ...props,
      styles,
    });
  }

  // Метод для безопасного получения сообщений
  public getMessage(): Message[] {
    return this.props.messages || [];
  }

  protected render(): string {
    return template;
  }
}