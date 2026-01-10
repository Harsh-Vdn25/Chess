import WebSocket from "ws";
import Chess from "@repo/common/chess";
import { MOVE,ERROR,INIT_GAME, GAME_OVER } from "@repo/common/config";
import { checkMove, sendMessage } from "./helpers/helper";
import { clientType } from "./redis/redisClient";
import { users } from "./helpers/state";

type onGameOver = (
    p1:number,
    p2:number,
    gameId:string
)=>void;

export class Game{
    //@ts-ignore
    public player1 : WebSocket;//@ts-ignore
    public player2 : WebSocket;
    public player1Id:number;
    public player2Id:number;
    public gameId: string;
    public chess: Chess;
    private redisClient : clientType;
    private onGameOver: onGameOver;
    constructor(player1:number,player2:number,redisClient:clientType,gameId:string,callback:onGameOver){
        this.player1Id = player1;
        this.player2Id = player2;
        this.gameId = gameId;
        this.chess= new Chess();
        this.redisClient = redisClient;
        this.onGameOver = callback;
        this.getPlayerSockets();
        this.initGame();
    }
    getPlayerSockets(){
        this.player1 = users.find(x=>x.userId === this.player1Id)?.socket !;
        this.player2 = users.find(x=>x.userId === this.player2Id)?.socket !;
    }
    initGame(){
        for(const {socket,color,userId} of [
            {socket:this.player1,color:"white" as const,userId:this.player1Id as number},
            {socket:this.player2,color:"black" as const,userId:this.player2Id as number}
        ]){
        sendMessage({
            type:INIT_GAME,
            userId:userId,
            gameId:this.gameId,
            payload:{color:color}
        },socket)
    }
    }
    
    async makeMove(socket: WebSocket,move : {
        from :string,
        to :string
    }){
        if((this.chess.turn()==='w' && socket===this.player2)){
            sendMessage({
                type:ERROR,
                payload:{message:"Its whites turn"}
            },socket);
            return;
        };
        if(this.chess.turn()==='b' &&socket=== this.player1){
            sendMessage({
                type: ERROR,
                payload:{
                    message:"Its blacks turn"
                }
            },socket);
            return;
        }
        try{
            let message;
            if(!checkMove(move.from) && !checkMove(move.to)){
                sendMessage({
                    type:ERROR,
                    payload:{message:"Invalid move"}
                },socket);
                return;
            }
            this.chess.move(move);
            if(this.chess.isCheckmate()){
                const colorWon = this.chess.turn() === 'b' ? "white" : "black"; 
                message={
                    type : GAME_OVER,
                    gameId: this.gameId,
                    payload:{
                        move:move,
                        winner:colorWon
                    }
                }
                await this.redisClient.xAdd(
                    "wins",
                    '*',{
                        json:JSON.stringify({message})
                    }
                )
            }else{
                message={
                    type:MOVE,
                    gameId:this.gameId,
                    payload:{
                        move:move
                    }
                }
                await this.redisClient.xAdd(
                    "games",
                    '*',
                    {   
                        json:JSON.stringify({message})
                    }
                )
            }
            for(const p of [this.player1,this.player2]){
                p.send(JSON.stringify(message));//using sendMessage is causing a type issue here 
            }
            if(message.type===GAME_OVER){
                this.onGameOver(this.player1Id,this.player2Id,this.gameId);
            }
        }catch(err){
            console.log(err);
        }
    }
}