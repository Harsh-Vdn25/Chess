import WebSocket from 'ws';
import { Game } from './Game';
import {INIT_GAME, MOVE} from '@repo/common/config';
import { clientType } from './redis/redisClient';
import { prisma } from '@repo/db/client';
import { decodeToken } from '@repo/backend-common/index';
export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket|null;
    private users: WebSocket[];
    private userId1:String | undefined;
    public redisClient:clientType;
    constructor(redisClient:clientType){
        this.games = [];
        this.users = [];
        this.pendingUser = null;
        this.redisClient = redisClient;
    }
    addUser(socket:WebSocket){
        this.users.push(socket);
    }
    async handleMessage(socket:WebSocket){
        socket.on('message',async (data : any)=>{
            const x= data.toString();
            const message = JSON.parse(x);
            if(message.type === INIT_GAME){
                 const token = message.token;
                 const userId = await decodeToken(token);
                 if(this.pendingUser === null){
                    this.pendingUser = socket;
                    this.userId1 = userId;
                 }else{
                    const saveGame = await prisma.game.create({
                        data:{
                            userId1:this.userId1,
                            userId2:userId
                        }
                    })
                    const game = new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser = null;
                 }
            }
            if(message.type === MOVE){
                const game = this.games.find(x=>x.player1 === socket || x.player2 === socket);
                game?.makeMove(socket,message.payload.move);
            }
        })
    }

    removeUser(socket:WebSocket){
        this.users.filter(x=>x !== socket);
    }
}