import chatTemplate from "../templates/chat.hbs?raw";
import Handlebars from "handlebars";
import styles from "../styles/pages/chat.module.css";
import chatItemTemplate from "../components/chatItem.hbs?raw";
import chatInterfaceTemplate from "../components/chatInterface.hbs?raw";

Handlebars.registerPartial("chatItem", chatItemTemplate);
Handlebars.registerPartial("chatInterface", chatInterfaceTemplate);

const chatData = {
  chats: [
    {
      id: 1,
      name: "Андрей",
      avatar: "/avatar.png",
      lastMessage: "Привет!",
      time: "10:49",
      hasUnread: true,
      unreadCount: 2,
      isActive: true,
    },
    {
      id: 2,
      name: "Виктор",
      avatar: "/avatar.png",
      lastMessage: "Как дела?",
      time: "10:52",
      hasUnread: false,
      unreadCount: 0,
      isActive: false,
    },
    {
      id: 3,
      name: "Лешка",
      avatar: "/avatar.png",
      lastMessage: "Как дела?",
      time: "10:52",
      hasUnread: false,
      unreadCount: 0,
      isActive: false,
    },
  ],
  messages: [
    { userName: "Андрей", time: "10:49", text: "Привет, как дела?" },
    { userName: "Виктор", time: "10:52", text: "Все хорошо, а у тебя?" },
  ], 
  activeChatId: 1, 
  attachment: "/attachment.png",
  sendButton: "/send-button.png",
  styles,
};

export function renderChatPage() {
  const app = document.getElementById("app");
  if (!app) return;


  const template = Handlebars.compile(chatTemplate);
  app.innerHTML = template(chatData);
}
