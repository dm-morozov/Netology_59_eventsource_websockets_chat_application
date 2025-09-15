// src/ts/chatWS.ts

import {
  Message,
  User,
  ServerPayload,
  ExitMessage,
  JoinMessage,
} from "./types";

// набор колбэков, которые будут передаваться
// из внешнего кода, чтобы ChatWS не зависел
// напрямую от интерфейса чата
// он просто сообщает события

export interface ChatWSEvents {
  // приходит новое сообщение (SendMessage, JoinMessage, ExitMessage)
  onMessage: (message: Message) => void;
  // приходит актуальный список пользователей (User[])
  onUsersList: (users: User[]) => void;
  // соединение закрыто
  onClose: (event: CloseEvent) => void;
  // произошла ошибка с сокетом
  onError: (event: Event) => void;
}

export default class ChatWS {
  private wsUrl: string;
  private events: ChatWSEvents;
  private socket: WebSocket | null = null;
  private currentUser: User | null = null;
  constructor(wsUrl: string, events: ChatWSEvents) {
    this.wsUrl = wsUrl; // Получает URL сервера WebSocket и объект с колбэками
    this.events = events; // сохраняет их в свойства класса
  }

  // подключается к серверу WebSocket
  public connect(user: User): void {
    // Проверка на то, что сокет уже подключен,
    // если подключен, то ничего не делаем
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("WebSocket уже подключен");
      return;
    }

    this.currentUser = user;

    // создаем новый сокет
    this.socket = new WebSocket(this.wsUrl);

    // Обработчик события открытия соединения
    this.socket.onopen = () => {
      console.log("WebSocket соединение открыто");
      const JoinMessage: JoinMessage = {
        type: "join",
        user: this.currentUser!,
      };
      this.sendMessage(JoinMessage);
    };

    // Обработчик входящих сообщений
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const payloud: ServerPayload = JSON.parse(event.data);

        // самое интересное. Проверяем тип сообщения.
        //  из типа export type ServerPayload = Message | User[];
        // если массив пользователей, то вызываем колбэк onUsersList
        // если сообщение, то вызываем колбэк onMessage
        if (Array.isArray(payloud)) {
          // Если это массив пользователей,
          // вызываем колбэк для обновления списка
          this.events.onUsersList(payloud);
        } else {
          // Если это объект сообщения,
          // вызываем колбэк для его отображения
          this.events.onMessage(payloud);
        }
      } catch (error) {
        console.error("Ошибка при парсинге сообщения от сервера:", error);
      }
    };

    // Обработчик события закрытия соединения
    this.socket.onclose = (event: CloseEvent) => {
      console.log("WebSocket-соединение закрыто:", event.reason);
      this.events.onClose(event);
    };

    // Обработчик события ошибки соединения
    this.socket.onerror = (event: Event) => {
      console.error("WebSocket-ошибка:", event);
      this.events.onError(event);
    };
  }

  public sendMessage(message: Message) {
    // Преобразуем объект сообщения в JSON и отправляем на сервер
    // только предварительно проверив, что сокет открыт, чтобы
    // избежать ошибки runtime
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket не подключен, сообщение не отправлено");
    }
  }

  // закрываем соединение
  public close(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const ExitMessage: ExitMessage = {
        type: "exit",
        user: this.currentUser!,
      };
      this.sendMessage(ExitMessage);

      setTimeout(() => {
        this.socket?.close();
      }, 500);
    }
  }
}
