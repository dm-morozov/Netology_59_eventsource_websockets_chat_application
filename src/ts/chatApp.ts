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
  private pingInterval: number | null = null;

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

    // Подписываемся на событие закрытия страницы
    this.chatUI.onPageUnload(this.handleUnload.bind(this));

    // Добавляем обработчик для события успешного открытия WS-соединения
    // Как только соединение открыто, скрываем прелоадер
    this.chatWS.onOpen(() => this.chatUI.hidePreloader());

    // Запускаем пингование при инициализации приложения
    this.startPinging();
  }

  // Метод для запуска пингования
  private startPinging(): void {
    // Пингуем каждые 2 минуты, чтобы сервер не заснул
    const pingTime = 2 * 60 * 1000;

    this.pingInterval = setInterval(() => {
      this.api.pingServer();
    }, pingTime) as unknown as number;

    console.log("Pinging to server started.");
  }

  // Обработчики событий от ChatUI

  public async handleLogin(): Promise<void> {
    const nickname = this.chatUI.getNickname();
    if (!nickname) {
      this.chatUI.showNicknameError("Имя не может быть пустым.");
      return;
    } else if (nickname.length > 20) {
      this.chatUI.showNicknameError("Имя не должно превышать 20 символов.");
      return;
    }

    // когда пользователь пытается войти
    this.chatUI.showPreloader();
    // Отправляем запрос на регистрацию через Api
    const response = await this.api.registerUser(nickname);

    if (response.status === "ok") {
      this.currentUser = response.user;
      this.chatUI.showChat();
      this.chatUI.hidePreloader();
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

  private handleUnload(): void {
    if (this.chatWS) {
      this.chatWS.close();
    }
  }
}

// Запускаем приложение
const serverUrl =
  "https://netology-59-eventsource-websockets-chat-ee9w.onrender.com";
const app = new ChatApp(serverUrl, `wss://${new URL(serverUrl).hostname}`);
app.init();
