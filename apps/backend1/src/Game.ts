import WebSocket from "ws";
import Chess from "@repo/common/chess";
import {
  MOVE,
  ERROR,
  INIT_GAME,
  GAME_OVER,
  WRONG_MOVE,
} from "@repo/common/config";
import { checkMove, sendMessage } from "./helpers/helper";
import { clientType } from "./redis/redisClient";
import { users } from "./helpers/state";
import { prisma } from "@repo/db/client";

type onGameOver = (p1: number, p2: number, gameId: string) => void;

export class Game {
  //@ts-ignore
  public player1: WebSocket; //@ts-ignore
  public player2: WebSocket;
  public player1Id: number;
  public player2Id: number;
  public gameId: string;
  private gameIdDB: string = "";
  public chess: Chess;
  private redisClient: clientType;
  private onGameOver: onGameOver;
  constructor(
    player1: number,
    player2: number,
    redisClient: clientType,
    gameId: string,
    callback: onGameOver,
  ) {
    this.player1Id = player1;
    this.player2Id = player2;
    this.gameId = gameId;
    this.chess = new Chess();
    this.redisClient = redisClient;
    this.onGameOver = callback;
    this.getPlayerSockets();
  }
  public async init() {
    await this.saveGame();
    this.initGame();
  }
  //this one saves the game to the DB
  public async saveGame() {
    try {
      const saveGame = await prisma.game.create({
        data: {
          userId1: this.player1Id,
          userId2: this.player2Id,
        },
      });
      if (!saveGame) {
        //later here remove the users connection to avoid further errors
        // remove the users when the failed to initialize the game
        sendMessage(
          {
            type: ERROR,
            payload: { message: "Failed to initialize the game" },
          },
          this.player1,
        );
        sendMessage(
          {
            type: ERROR,
            payload: { message: "Failed to initialize the game" },
          },
          this.player1,
        );
        this.onGameOver(this.player1Id, this.player2Id, this.gameId);
        return;
      }
      this.gameIdDB = saveGame.id;
      console.log(this.gameIdDB);
    } catch (err) {
      console.log(err);
    }
  }

  getPlayerSockets() {
    this.player1 = users.find((x) => x.userId === this.player1Id)?.socket!;
    this.player2 = users.find((x) => x.userId === this.player2Id)?.socket!;
  }

  initGame() {
    for (const { socket, color, userId } of [
      {
        socket: this.player1,
        color: "white" as const,
        userId: this.player1Id as number,
      },
      {
        socket: this.player2,
        color: "black" as const,
        userId: this.player2Id as number,
      },
    ]) {
      sendMessage(
        {
          type: INIT_GAME,
          userId: userId,
          gameId: this.gameId,
          payload: { color: color },
        },
        socket,
      );
    }
  }

  async makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    },
  ) {
    if (this.chess.turn() === "w" && socket === this.player2) {
      sendMessage(
        {
          type: ERROR,
          payload: { message: "Its whites turn" },
        },
        socket,
      );
      return;
    }
    if (this.chess.turn() === "b" && socket === this.player1) {
      sendMessage(
        {
          type: ERROR,
          payload: {
            message: "Its blacks turn",
          },
        },
        socket,
      );
      return;
    }
    try {
      let message;
      if (!checkMove(move.from) && !checkMove(move.to)) {
        sendMessage(
          {
            type: WRONG_MOVE,
            payload: { message: "Invalid move" },
          },
          socket,
        );
        return;
      }
      this.chess.move(move);
      if (this.chess.isCheckmate()) {
        const colorWon = this.chess.turn() === "b" ? "white" : "black";
        const winnerId = colorWon === "white" ? this.player1Id : this.player2Id;
        const loserId = colorWon === "white" ? this.player2Id : this.player1Id;
        message = {
          type: GAME_OVER,
          gameId: this.gameId,
          payload: {
            move: move,
            winner: colorWon,
            winnerId: winnerId,
            loserId: loserId,
          },
        };
        await this.redisClient.xAdd("wins", "*", {
          json: JSON.stringify({
            gameId: this.gameIdDB,
            winnerId: message.payload.winnerId,
            loserId: message.payload.loserId,
          }),
        });
      } else {
        message = {
          type: MOVE,
          gameId: this.gameId,
          payload: {
            move: move,
          },
        };
        await this.redisClient.xAdd("games", "*", {
          json: JSON.stringify({
            gameId: this.gameIdDB,
            move: message.payload.move,
          }),
        });
      }
      for (const p of [this.player1, this.player2]) {
        p.send(JSON.stringify(message)); //using sendMessage is causing a type issue here
      }
      if (message.type === GAME_OVER) {
        this.onGameOver(this.player1Id, this.player2Id, this.gameId);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
