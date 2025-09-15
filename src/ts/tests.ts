// src/ts/tests.ts

import ChatUI from "./chatUI";
import { User, SendMessage } from "./types";

// Тестовые пользователи
const currentUser: User = { id: "1", name: "Вася" };
const otherUser: User = { id: "2", name: "Петя" };

// Инициализируем ChatUI
const chatUI = new ChatUI();
chatUI.showChat();

// Тестовые сообщения
const myMsg1: SendMessage = { type: "send", user: currentUser, message: "Привет, это я, Вася!" };
const otherMsg1: SendMessage = { type: "send", user: otherUser, message: "Привет, это Петя!" };
const myMsg2: SendMessage = { type: "send", user: currentUser, message: "Как дела?" };
const otherMsg2: SendMessage = { type: "send", user: otherUser, message: "Всё хорошо, спасибо!" };

// Выводим сообщения, передавая им currentUser для сравнения
chatUI.renderMessage(myMsg1, currentUser);    // должно выровняться справа
chatUI.renderMessage(otherMsg1, currentUser); // должно выровняться слева
chatUI.renderMessage(myMsg2, currentUser);    // должно выровняться справа
chatUI.renderMessage(otherMsg2, currentUser); // должно выровняться слева