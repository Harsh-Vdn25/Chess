import WebSocket from "ws";
import Chess, { WHITE } from "@repo/common/chess";
import { MOVE,ERROR,INIT_GAME, GAME_OVER } from "@repo/common/config";
import { checkMove, sendMessage } from "./helpers/helper";
export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private chess: Chess;
    constructor(player1:WebSocket,player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.chess= new Chess();
        this.initGame();
    }
    initGame(){
        for(const {socket,color} of [
            {socket:this.player1,color:"white" as const},
            {socket:this.player2,color:"black" as const}
        ]){
        sendMessage({
            type:INIT_GAME,
            payload:{color:color}
        },socket)
    }
    }
    
    makeMove(socket: WebSocket,move : {
        from :string,
        to :string
    }){
        if(this.chess.isCheckmate()){
            socket.send(JSON.stringify({
                type:GAME_OVER
            }))
        };
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
                const player=this.chess.turn() === 'b' ? this.player1 : this.player2;
                const colorWon= player === this.player1 ? "white": "black";
                message={
                    type : GAME_OVER,
                    payload:{
                        move:move,
                        winner:`${colorWon} Won`
                    }
                }
            }else{
                message={
                    type:MOVE,
                    payload:{
                        move:move
                    }
                }
            }
            for(const p of [this.player1,this.player2]){
                p.send(JSON.stringify(message));
            }
        }catch(err){
            console.log(err);
        }
    }
}