import WebSocket from 'ws';
import { Game } from './Game';
import {ERROR, INIT_GAME, MOVE, REJOIN, TOKEN_ERROR} from '@repo/common/config';
import { clientType } from './redis/redisClient';
import { prisma } from '@repo/db/client';
import { verifyToken } from '@repo/backend-common/index';
import { users,type usersType} from './helpers/state';
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
        users.push({socket,userId}); // users: global in-memory list of connected users this thing is in the helpers/state file
    }
    checkUser(userId:number){
        return users.find(x=>x.userId === userId);
    }
    async handleMessage(socket:WebSocket,token:string){
        socket.on('message',async (data : any)=>{
            const x= data.toString();
            const message = JSON.parse(x);
            if(message.type === INIT_GAME){
                 const userId = Number(await verifyToken(token,process.env.ACCESS_SECRET !));
                 if(!userId){
                    return sendMessage({type:TOKEN_ERROR,payload:{message:"unable to retrive the token .Login again"}},socket);
                 }
                 const isExisting = this.checkUser(userId);
                 if(isExisting){
                    const ExistingUser = isExisting.userId;
                    users.map(x=>{
                        x.socket=(x.userId === ExistingUser ? socket : x.socket ) 
                    })
                    //Checking whether the game is actually present or not 
                    const chess = this.games.find(x=>(x.player1Id === ExistingUser || x.player2Id === ExistingUser));

                    //this line finds the sockets for their userIds as socket updated previously above
                    chess?.getPlayerSockets();
                    chess?.initGame();//send the colours after the refresh;
                    const FEN = chess?.chess.fen();
                    return sendMessage({type:REJOIN,payload:{FEN: FEN }},socket);
                 }else{
                    this.addUser({socket,userId});
                    if(this.pendingUser === -1){
                        this.pendingUser = userId;
                    }else{
                       if(this.pendingUser === userId){ //if the pedingUser logs in again then this is triggered
                           return sendMessage({type:ERROR,payload:{message:"You cant play two games simultaneously"}},socket)
                       }
                       this.player2 = userId;
                       try{
                           const saveGame = await prisma.game.create({
                               data:{
                                   userId1:this.pendingUser,
                                   userId2:this.player2
                               }
                           })
                           if(!saveGame){ //later here remove the users connection to avoid further errors 
                            sendMessage({type:ERROR,payload:{message:"Failed to initialize the game"}},socket);
                            return ;
                           }
                           const game = new Game(this.pendingUser,this.player2,this.redisClient,saveGame.id,
                            (p1,p2,gameId)=>
                                {
                                    this.endGame({p1,p2,gameId})
                                });
                           this.games.push(game);
                           this.pendingUser = -1;
                           this.player2 = -1;
                       }catch(err){
                           console.log(err);
                           return;
                       }
                    }
                 }
            }
            if(message.type === MOVE){
                const gameId = message.gameId;
                const game = this.games.find(x=>x.gameId === gameId);
                game?.makeMove(socket,message.payload.move);
            }
        })
    }
    endGame({p1,p2,gameId}:{
        p1:number,
        p2:number,
        gameId:string
    }){
        this.games = this.games.filter(x=>x.gameId ! = gameId);
        for(let i=users.length-1;i>=0;i++){
            //looping back cuz using splice while moving forward might shift the elements andsome might be ignored
            if(users[i]?.userId === p1 || users[i]?.userId === p2){
                users.splice(i,1);
            }
        }
    }
    //this function has to be change (try using userIds)
    removeUser(socket:WebSocket){
        users.filter(x=>x.socket!==socket);
    }
}