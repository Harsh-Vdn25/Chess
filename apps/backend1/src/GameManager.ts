import WebSocket from 'ws';
import { Game } from './Game';
import {ERROR, INIT_GAME, MOVE, REJOIN} from '@repo/common/config';
import { clientType } from './redis/redisClient';
import { prisma } from '@repo/db/client';
import { decodeToken } from '@repo/backend-common/index';
import { userGame,users,type usersType} from './helpers/state';
import { sendMessage } from './helpers/helper';

export class GameManager{
    private games: Game[];
    private pendingUser: number=-1;
    private player2:number =-1;
    public redisClient:clientType;
    constructor(redisClient:clientType){
        this.games = [];
        this.redisClient = redisClient;
    }
    addUser({socket,userId}:usersType){
        users.push({socket,userId});
    }
    checkUser(userId:number){
        return users.find(x=>x.userId === userId);
    }
    async handleMessage(socket:WebSocket,token:string){
        socket.on('message',async (data : any)=>{
            const x= data.toString();
            const message = JSON.parse(x);
            if(message.type === INIT_GAME){
                 const userId = await decodeToken(token);
                 const isExisting = this.checkUser(userId);
                 if(isExisting){
                    const ExistingUser = isExisting.userId;
                    users.map(x=>{
                        x.socket=(x.userId === ExistingUser ? socket : x.socket ) 
                    })
                    const chess = this.games.find(x=>(x.player1Id === userId || x.player2Id === userId));
                    chess?.getPlayerSockets();
                    chess?.initGame();//send the colours after the refresh;
                    const FEN = chess?.chess.fen();
                    return sendMessage({type:REJOIN,payload:{FEN: FEN}},socket);
                 }
                 this.addUser({socket,userId});
                 if(this.pendingUser === -1){
                    this.pendingUser = userId;
                 }else{
                    this.player2 = userId;
                    if(this.pendingUser === userId){ //if the pedingUser logs in again then this is triggered
                        return sendMessage({type:ERROR,payload:{message:"You cant play two games simultaneously"}},socket)
                    }
                    try{
                        const saveGame = await prisma.game.create({
                            data:{
                                userId1:this.pendingUser,
                                userId2:this.player2
                            }
                        })
                        userGame.push({
                            player1:this.pendingUser,
                            player2:this.player2,
                            gameId:saveGame.id
                        });
                        const game = new Game(this.pendingUser,this.player2,this.redisClient,saveGame.id);
                        this.games.push(game);
                        this.pendingUser = -1;
                        this.player2 = -1;
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