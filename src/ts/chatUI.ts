import { User } from "./types";

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

      const isCurrentUser = user.id === currentUser.id;

      if (isCurrentUser) {
        li.textContent = "Вы";
        li.classList.add("current-user");
      } else {
        li.textContent = user.name;
        li.classList.add("other-user");
      }

      this.usersList?.append(li);
    });
  }
}
