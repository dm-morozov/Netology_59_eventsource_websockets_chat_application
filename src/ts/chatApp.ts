// chatApp.ts

import Api from "./api";
import ChatUI from "./chatUI";
import ChatWS, { ChatWSEvents } from "./chatWS";
import { User, Message, SendMessage } from "./types";

export default class ChatApp {
  private api: Api;
  private chatUI: ChatUI;
  private chatWS: ChatWS;
  private currentUser: User | null = null;

  constructor(apiUrl: string, wsUrl: string) {
    this.api = new Api(apiUrl);
    this.chatUI = new ChatUI();

    const wsEvents: ChatWSEvents = {
      onMessage: this.handleMessage.bind(this),
      onUsersList: this.handleUsersList.bind(this),
      onClose: this.handleWSClose.bind(this),
      onError: this.handleWSError.bind(this),
    };

    this.chatWS = new ChatWS(wsUrl, wsEvents);
  }

  // Основной метод для запуска приложения
  public init(): void {
    // Подписываемся на событие нажатия кнопки "Войти"
    this.chatUI.onLogin(this.handleLogin.bind(this));

    // Подписываемся на событие отправки сообщений
    this.chatUI.onSendMessage(this.handleSendMessage.bind(this));
  }

  // Обработчики событий от ChatUI

  public async handleLogin(): Promise<void> {
    const nickname = this.chatUI.getNickname();
    if (!nickname) {
      this.chatUI.showNicknameError("Имя не может быть пустым.");
      return;
    }

    // Отправляем запрос на регистрацию через Api
    const response = await this.api.registerUser(nickname);

    if (response.status === "ok") {
      this.currentUser = response.user;
      this.chatUI.showChat();
      this.chatWS.connect(this.currentUser);
    } else {
      this.chatUI.showNicknameError(response.message);
    }
  }

  private handleSendMessage(messageText: string): void {
    if (!this.currentUser) return;

    const message: SendMessage = {
      type: "send",
      user: this.currentUser,
      message: messageText,
    };

    // Отправляем сообщение через ChatWS
    this.chatWS.sendMessage(message);
  }

  // Обработчики событий от ChatWS

  private handleMessage(message: Message): void {
    if (!this.currentUser) return;
    this.chatUI.renderMessage(message, this.currentUser);
  }

  private handleUsersList(users: User[]): void {
    if (!this.currentUser) return;
    this.chatUI.renderUserList(users, this.currentUser);
  }

  private handleWSClose(event: CloseEvent): void {
    console.log(
      "Соединение закрыто, код:",
      event.code,
      "причина:",
      event.reason,
    );
  }

  private handleWSError(event: Event): void {
    console.error("Ошибка WebSocket:", event);
  }
}

// Запускаем приложение
const app = new ChatApp("http://localhost:3000", "ws://localhost:3000");
app.init();
