import WebSocket from "ws";
import { Game } from "./Game";
import {
  ERROR,
  INIT_GAME,
  MOVE,
  REJOIN,
  TOKEN_ERROR,
} from "@repo/common/config";
import { clientType } from "./redis/redisClient";
import { nanoid } from "nanoid";
import { verifyToken } from "@repo/backend-common/index";
import { users, type usersType } from "./helpers/state";
import { sendMessage } from "./helpers/helper";
import { Queue } from "./helpers/Queue";

export class GameManager {
  private games: Game[];
  private playersQueue: Queue<number>;
  public redisClient: clientType;
  constructor(redisClient: clientType) {
    this.games = [];
    this.redisClient = redisClient;
    this.playersQueue = new Queue<number>(); //push all the players into the queue
    this.startMatchMaking();
  }

  addUser({ socket, userId }: usersType) {
    users.push({ socket, userId }); // users: global in-memory list of connected users this thing is in the helpers/state file
  }
  checkUser(userId: number) {
    return users.find((x) => x.userId === userId);
  }
  async handleMessage(socket: WebSocket, token: string) {
    socket.on("message", async (data: any) => {
      const x = data.toString();
      const message = JSON.parse(x);
      if (message.type === INIT_GAME) {
        const userId = Number(
          await verifyToken(token, process.env.AUTH_SECRET!),
        );
        if (!userId) {
          return sendMessage(
            {
              type: TOKEN_ERROR,
              payload: { message: "unable to retrive the token .Login again" },
            },
            socket,
          );
        }

        const isExisting = this.checkUser(userId);
        if (isExisting) {
          const ExistingUser = isExisting.userId;
          users.map((x) => {
            x.socket = x.userId === ExistingUser ? socket : x.socket;
          });
          //Checking whether the game is actually present or not
          const chess = this.games.find(
            (x) => x.player1Id === ExistingUser || x.player2Id === ExistingUser,
          );

          //this line finds the sockets for their userIds as socket updated previously above
          chess?.getPlayerSockets();
          chess?.initGame(); //send the colours after the refresh;
          const FEN = chess?.chess.fen();
          return sendMessage({ type: REJOIN, payload: { FEN: FEN } }, socket);
        } else {
          this.addUser({ socket, userId });
          
          if (this.playersQueue.contains(userId)) {
            return sendMessage(
              { type: ERROR, payload: { message: "Already waiting" } },
              socket,
            );
          }

          this.playersQueue.enqueue(userId);
        }
      }
      if (message.type === MOVE) {
        const gameId = message.gameId;
        const game = this.games.find((x) => x.gameId === gameId);
        game?.makeMove(socket, message.payload.move);
      }
    });
  }
  startMatchMaking() {
    setInterval(async () => {
      while (this.playersQueue.size() >= 2) {
        const p1 = this.playersQueue.dequeue()!;
        const p2 = this.playersQueue.dequeue()!;

        //verify both the sockets before matchmaking
        const p1User = users.find((x) => x.userId === p1);
        const p2User = users.find((x) => x.userId === p2);

        if (!p1User || p1User?.socket.readyState !== WebSocket.OPEN) {
          //p1 socket is dead so put p2 back into the queue
          this.playersQueue.enqueue(p2);
          continue;
        }

        if (!p2User || p2User.socket.readyState !== WebSocket.OPEN) {
          //p2 socket is dead so put p1 back into the queue
          this.playersQueue.enqueue(p1);
          continue;
        }

        const gameId = nanoid(10);
        const game = new Game(
          p1,
          p2,
          this.redisClient,
          gameId,
          (p1, p2, gameId) => {
            this.endGame({ p1, p2, gameId });
          },
        );

        this.games.push(game);
        await game.init();
      }
    }, 500);
  }

  removeUser({ p1, p2 }: { p1: number; p2: number }) {
    for (let i = users.length; i >= 0; i--) {
      if (users[i]?.userId === p1 || users[i]?.userId === p2) {
        users.splice(i, 1);
      }
    }
  }
  endGame({ p1, p2, gameId }: { p1: number; p2: number; gameId: string }) {
    this.games = this.games.filter((x) => x.gameId !== gameId);
    this.removeUser({ p1, p2 });
  }
}
