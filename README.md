# Домашнее задание к занятию "EventSource, Websockets" — Создание Чата

---

### Статус проекта
[![Build status](https://ci.appveyor.com/api/projects/status/4siy8fk0hnkn3v25?svg=true)](https://ci.appveyor.com/project/dm-morozov/netology-59-eventsource-websockets-chat-applicatio)
![CI](https://github.com/dm-morozov/Netology_59_eventsource_websockets_chat_application/actions/workflows/web.yaml/badge.svg)
![Netology](https://img.shields.io/badge/FrontendTS-BackendNodeJS-blue)

[**Ссылка на проект на GitHub Pages**](https://dm-morozov.github.io/Netology_59_eventsource_websockets_chat_application/)

---

Порядок работы

Типы (types.ts) — готово ✅
Теперь у тебя строгая модель данных, и IDE поможет не ошибаться.

HTML (каркас приложения) — да, пора писать index.html.
Причём не всё сразу, а простой каркас:

модалка с вводом имени,

блок для списка пользователей,

блок для сообщений,

поле ввода + кнопка «Отправить».

Классы под функциональность
Когда есть каркас, проще двигаться:

ApiService — общение с REST API (/new-user).

ChatService — работа с WebSocket.

UI (или ChatUI) — рендеринг и обновление DOM.

App — связывает всё вместе.

Webpack
У тебя уже подключен. Проверим, что сборка берёт index.ts и кладёт результат в dist.


src/
  ts/
    api.ts
    chatUI.ts
    chatWS.ts
    chatApp.ts
    types.ts
    tests.ts
  index.ts
  index.html
  css/
    style.css
-----



## 📧 Контакты

Если возникнут вопросы, пишите:

* ![LinkedIn](./svg/linkedin-icon.svg) [LinkedIn](https://www.linkedin.com/in/dm-morozov/)
* ![Telegram](./svg/telegram.svg) [Telegram](https://t.me/dem2014)
* ![GitHub](./svg/github-icon.svg) [GitHub](https://github.com/dm-morozov/)

---