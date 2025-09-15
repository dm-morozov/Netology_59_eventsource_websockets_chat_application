// src/ts/api.ts

import {
  NewUserResponse,
  // NewUserResponseOk,
  NewUserResponseError,
} from "./types";

// Класс для взаимодействия с REST API сервера.
// Отвечает за регистрацию нового пользователя.

export default class Api {
  private apiUrl: string = "http://localhost:3000";

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public async registerUser(name: string): Promise<NewUserResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/new-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      // Парсим ответ от сурвера в формате JSON
      const data = await response.json();

      // if(!response.ok) {
      //   return {
      //     status: 'error',
      //     message: data.message,
      //   } as NewUserResponseError;
      // }

      // return {
      //   status: 'ok',
      //   user: data.user,
      // } as NewUserResponseOk;

      // Сервер сам возвращает нужный формат, поэтому просто возвращаем данные
      // Если status: "ok", вернется NewUserResponseOk
      // Если status: "error", вернется NewUserResponseError
      // Как поняли? Посмотрели в types.ts и server.ts
      return data;
    } catch (error) {
      console.error("Ошибка при регистрации пользователя:", error);
      return {
        status: "error",
        message: "Не удалось соединиться с сервером. Попробуйте позже.",
      } as NewUserResponseError;
    }
  }
}
