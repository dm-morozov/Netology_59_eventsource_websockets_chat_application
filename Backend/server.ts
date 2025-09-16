// server.ts

import { randomUUID } from "node:crypto";
import http from "node:http";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import pino from "pino";
import pinoPretty from "pino-pretty";
import WebSocket, { WebSocketServer } from "ws";

// --------------------
// Типы
// --------------------
interface User {
  id: string;
  name: string;
}

interface Message {
  type: "send" | "exit";
  user: User;
  text?: string;
}

// --------------------
// Настройки
// --------------------
const app = express();
const logger = pino(pinoPretty());

app.use(cors());
app.use(
  bodyParser.json({
    type() {
      return true;
    },
  })
);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// --------------------
// Логика пользователей
// --------------------
const userState: User[] = [];

app.post("/new-user", (request: Request, response: Response) => {
  if (Object.keys(request.body).length === 0) {
    const result = {
      status: "error",
      message: "Empty request body!",
    };
    response.status(400).json(result).end();
    return;
  }

  const { name } = request.body as { name: string };
  const isExist = userState.find((user) => user.name === name);

  if (!isExist) {
    const newUser: User = {
      id: randomUUID(),
      name,
    };
    userState.push(newUser);

    const result = {
      status: "ok",
      user: newUser,
    };

    logger.info(`New user created: ${JSON.stringify(newUser)}`);
    response.json(result).end();
  } else {
    const result = {
      status: "error",
      message: "This name is already taken!",
    };

    logger.error(`User with name "${name}" already exists`);
    response.status(409).json(result).end();
  }
});

// --------------------
// WebSocket сервер
// --------------------
const server = http.createServer(app);
const wsServer = new WebSocketServer({ server });

wsServer.on("connection", (ws: WebSocket) => {
  ws.on("message", (msg: WebSocket.RawData, isBinary: boolean) => {
    const receivedMSG: Message = JSON.parse(msg.toString());
    logger.info(`Message received: ${JSON.stringify(receivedMSG)}`);

    // обработка отправки сообщения
    if (receivedMSG.type === "send") {
      [...wsServer.clients]
        .filter((o) => o.readyState === WebSocket.OPEN)
        .forEach((o) => o.send(msg, { binary: isBinary }));

      logger.info("Message sent to all users");
      return;
    }
    
    // обработка выхода пользователя
    if (receivedMSG.type === "exit") {
      const idx = userState.findIndex(
        (user) => user.name === receivedMSG.user.name
      );
      if (idx !== -1) {
        userState.splice(idx, 1);
      }
      
      // Пересылаем сообщение о выходе всем клиентам
      [...wsServer.clients]
        .filter((o) => o.readyState === WebSocket.OPEN)
        .forEach((o) => o.send(msg, { binary: isBinary }));
        
      // Затем отправляем обновлённый список пользователей
      [...wsServer.clients]
        .filter((o) => o.readyState === WebSocket.OPEN)
        .forEach((o) => o.send(JSON.stringify(userState)));

      logger.info(
        `User with name "${receivedMSG.user.name}" has been deleted`
      );
      return;
    }
    
    // обработка входа пользователя
    if (receivedMSG.type === "join") {
      // Пересылаем сообщение о входе всем клиентам
      [...wsServer.clients]
        .filter((o) => o.readyState === WebSocket.OPEN)
        .forEach((o) => o.send(msg, { binary: isBinary }));
      
      // Затем отправляем обновлённый список пользователей
      [...wsServer.clients]
        .filter((o) => o.readyState === WebSocket.OPEN)
        .forEach((o) => o.send(JSON.stringify(userState)));

      logger.info(
        `User with name "${receivedMSG.user.name}" has joined`
      );
      return;
    }
  });

  // при новом подключении отправляем текущее состояние
  [...wsServer.clients]
    .filter((o) => o.readyState === WebSocket.OPEN)
    .forEach((o) => o.send(JSON.stringify(userState)));
});

// --------------------
// Запуск сервера
// --------------------
const port = process.env.PORT || 3000;

const bootstrap = async () => {
  try {
    server.listen(port, () =>
      logger.info(`Server has been started on http://localhost:${port}`)
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error("Unknown error");
    }
  }
};

bootstrap();
