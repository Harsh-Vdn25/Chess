import { ERROR, INIT_GAME, MOVE } from "@repo/common/config";
import { Chess, Move } from "chess.js";
import WebSocket from "ws";
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
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            color:"white"
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            color:"black"
        }))
    }
    makeMove(socket: WebSocket,move : {
        from :string,
        to :string
    }){
        if((this.chess.turn()==='w' && socket===this.player2)){
            socket.send(JSON.stringify({
                type:ERROR,
                payload:{
                    message:"Its whites turn"
                }
            }))
            return;
        };
        if(this.chess.turn()==='b' &&socket=== this.player1){
            socket.send(JSON.stringify({
                type: ERROR,
                payload:{
                    message:"Its blacks turn"
                }
            }))
            return;
        }
        try{
            this.chess.move(move);
            for(const p of [this.player1,this.player2]){
                p.send(JSON.stringify({
                    type:MOVE,
                    payload:{
                        move:move
                    }
                }))
            }
        }catch(err){
            console.log(err);
        }
    }
}