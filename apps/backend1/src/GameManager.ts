import WebSocket from 'ws';
import { Game } from './Game';
import {ERROR, INIT_GAME, MOVE} from '@repo/common/config';
import { clientType } from './redis/redisClient';
import { prisma } from '@repo/db/client';
import { decodeToken } from '@repo/backend-common/index';
import { userGame,users,type usersType} from './helpers/state';
import { sendMessage } from './helpers/helper';

export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket|null;
    private player1:number =-1;
    public redisClient:clientType;
    constructor(redisClient:clientType){
        this.games = [];
        this.pendingUser = null;
        this.redisClient = redisClient;
    }
    addUser({socket,userId}:usersType){
        users.push({socket,userId});
    }
    async handleMessage(socket:WebSocket){
        socket.on('message',async (data : any)=>{
            const x= data.toString();
            const message = JSON.parse(x);
            if(message.type === INIT_GAME){
                 const token = message.token;
                 const userId = await decodeToken(token);
                 this.addUser({socket,userId});
                 if(this.pendingUser === null){
                    this.pendingUser = socket;
                    this.player1 = userId;
                 }else{
                    if(this.player1 === userId){
                        return sendMessage({type:ERROR,payload:{message:"You cant play two games simultaneously"}},socket)
                    }
                    try{
                        const saveGame = await prisma.game.create({
                            data:{
                                userId1:this.player1,
                                userId2:userId
                            }
                        })
                        userGame.push({
                            player1:this.player1,
                            player2:saveGame.userId2,
                            gameId:saveGame.id
                            });
                        this.player1=-1;
                        const game = new Game(this.pendingUser,socket,this.redisClient,saveGame.id);
                        this.games.push(game);
                        this.pendingUser = null;
                    }catch(err){
                        console.log(err);
                        return;
                    }
                 }
            }
            if(message.type === MOVE){
                const game = this.games.find(x=>x.player1 === socket || x.player2 === socket);
                game?.makeMove(socket,message.payload.move);
            }
        })
    }

    removeUser(socket:WebSocket){
        users.filter(x=>x.socket!==socket);
    }
}