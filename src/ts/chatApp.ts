// chatApp.ts

import ChatUI from "./chatUI";

const chatUI = new ChatUI();

chatUI.showChat();

// Сделаем что-бы команда chatUI.showChat() была доступна в глобальном контексте
(window as any).chatUI = chatUI;