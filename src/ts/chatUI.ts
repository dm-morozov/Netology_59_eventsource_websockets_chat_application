import { User, Message } from "./types";

export default class ChatUI {
  private modal: HTMLDivElement | null;
  private nicknameInput: HTMLInputElement | null;
  private modalLoginBtn: HTMLButtonElement | null;
  private errorText: HTMLParagraphElement | null;

  private chatContainer: HTMLDivElement | null;
  private usersList: HTMLUListElement | null;
  private messagesBox: HTMLDivElement | null;
  private chatForm: HTMLFormElement | null;
  private chatInput: HTMLInputElement | null;

  constructor() {
    this.modal = document.querySelector("#modal") as HTMLDivElement;
    this.nicknameInput = document.querySelector(
      "#nickname",
    ) as HTMLInputElement;
    this.modalLoginBtn = document.querySelector(
      "#modal-login-btn",
    ) as HTMLButtonElement;
    this.errorText = document.querySelector(
      "#modal-error",
    ) as HTMLParagraphElement;

    this.chatContainer = document.querySelector(
      "#chat-container",
    ) as HTMLDivElement;
    this.usersList = document.querySelector("#users-list") as HTMLUListElement;
    this.messagesBox = document.querySelector(
      "#messages-box",
    ) as HTMLDivElement;
    this.chatForm = document.querySelector("#chat-form") as HTMLFormElement;
    this.chatInput = document.querySelector("#chat-input") as HTMLInputElement;
  }

  // --- Методы для управления модальным окном и чатом ---

  // Скрывает модальное окно и показывает чат
  public showChat(): void {
    if (this.modal) {
      this.modal.classList.add("hidden");
    }
    if (this.chatContainer) {
      this.chatContainer.classList.remove("hidden");
    }
  }

  // показывает ошибку в модальном окне
  public showNicknameError(message: string): void {
    if (this.errorText) {
      this.errorText.textContent = message;
      this.errorText.classList.remove("visible");
    }
  }

  // Теперь нужно ошибку еще очистеть и скрыть
  public clearNicknameError(): void {
    if (this.errorText) {
      this.errorText.textContent = "";
      this.errorText.classList.add("visible");
    }
  }

  // Теперь уберем у Имени лишник пробеллы и вернем
  public getNickname(): string {
    return this.nicknameInput?.value.trim() || "";
  }

  // --- Методы для отрисовки контента ---

  public renderUserList(users: User[], currentUser: User): void {
    if (!this.usersList) return;

    this.usersList.innerHTML = "";

    users.forEach((user) => {
      const li = document.createElement("li");
      // Проверяем, является ли пользователь текущим
      const isCurrentUser = user.id === currentUser.id;

      // и если является, добавляем класс current-user
      if (isCurrentUser) {
        li.textContent = "You";
        li.classList.add("current-user");
      } else {
        li.textContent = user.name;
        li.classList.add("other-user");
      }

      this.usersList?.append(li);
    });
  }

  public renderMessage(message: Message, currentUser: User): void {
    if (!this.messagesBox) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Проверяем тип. Если это обычное сообщение, то send, иначе exit

    if (message.type === "send") {
      // Нужно определить с какой стороны выводить сообщение
      // Для этого определим наше это сообщение или не наше.
      const isCurrentUser = message.user.id === currentUser.id;

      if (isCurrentUser) {
        messageElement.classList.add("my-message");
      } else {
        messageElement.classList.add("other-message");
      }

      // Собирем текст сообщения
      const userName = isCurrentUser ? "You" : message.user.name;
      const time = new Date().toLocaleDateString();

      // Так как по заданию стоит:
      // export interface SendMessage {
      //   type: "send";
      //   user: User;
      //   message: string;
      // }
      const messageText = message.message;

      messageElement.innerHTML = `
        <div class="message-info">
          <span class="message-username">${userName}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${messageText}</div>
      `;
    } else if (message.type === "exit") {
      messageElement.classList.add("system-message");
      const time = new Date().toLocaleTimeString();
      messageElement.innerHTML = `
        <div class="message-info">
          <span class="message-time">${time}</span>
        </div>
        <div class="message-text">💡 Пользователь ${message.user.name} вышел из чата</div>
      `;
    }

    // Дай бог все собрали, добавляем в контейнер
    this.messagesBox?.append(messageElement);
    // добавим автоматический скрол,
    // чтобы сообщение последнее было внизу
    this.messagesBox.scrollTop = this.messagesBox.scrollHeight;
  }
}
