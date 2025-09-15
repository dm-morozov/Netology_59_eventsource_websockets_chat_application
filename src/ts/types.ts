// src/ts/types.ts

// Описание структуры пользователя
export interface User {
  id: string;
  name: string;
}

// Сообщение, которое отправляет клиент/сервер при обычной отправке текста
export interface SendMessage {
  type: "send";
  user: User;
  message: string;
}

// Сообщение для входа пользователя
export interface JoinMessage {
  type: "join";
  user: User;
}

// Сообщение выхода пользователя
export interface ExitMessage {
  type: "exit";
  user: User;
}

// Union всех возможных сообщений по WS
export type Message = SendMessage | ExitMessage | JoinMessage;

// Сервер может передать либо Message,
// либо массив пользователей (userState)
export type ServerPayload = Message | User[];

// Тип ответа от POST /new-user
export interface NewUserResponseOk {
  status: "ok";
  user: User;
}

// Тип ответа от POST /new-user
export interface NewUserResponseError {
  status: "error";
  message: string;
}

// Union всех возможных ответов от POST /new-user
export type NewUserResponse = NewUserResponseOk | NewUserResponseError;
