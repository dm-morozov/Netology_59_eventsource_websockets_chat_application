// src/ts/tests.ts

import ChatUI from "./chatUI";
import { User, SendMessage, ExitMessage, JoinMessage, Message } from "./types";

// Тестовые пользователи
const currentUser: User = { id: "1", name: "Вася" };
const otherUser: User = { id: "2", name: "Петя" };

// Инициализируем ChatUI
const chatUI = new ChatUI();
chatUI.showChat();

// Сообщение входа
const joinMsg1: JoinMessage = {
  type: "join",
  user: currentUser,
};

const joinMsg2: JoinMessage = {
  type: "join",
  user: otherUser,
};

// Тестовые сообщения
const myMsg1: SendMessage = {
  type: "send",
  user: currentUser,
  message: "Привет, это я, Вася!",
};
const otherMsg1: SendMessage = {
  type: "send",
  user: otherUser,
  message: "Привет, это Петя!",
};
const myMsg2: SendMessage = {
  type: "send",
  user: currentUser,
  message: "Как дела?",
};
const otherMsg2: SendMessage = {
  type: "send",
  user: otherUser,
  message: "Всё хорошо, спасибо!",
};

// Сообщение выхода
const exitMsg: ExitMessage = {
  type: "exit",
  user: otherUser,
};

// Выводим сообщения, передавая currentUser для сравнения
const messages: Message[] = [
  joinMsg1,
  joinMsg2,
  myMsg1,
  otherMsg1,
  myMsg2,
  otherMsg2,
  exitMsg,
];

messages.forEach((msg) => chatUI.renderMessage(msg, currentUser));
