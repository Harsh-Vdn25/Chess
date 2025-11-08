import { Chess, validateFen } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, MOVE } from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    public board:Chess;
    private startTime: Date;
    constructor(player1:WebSocket,player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board=new Chess();
        this.startTime = new Date();
    }
    makeMove(socket: WebSocket,move:{
        from: string,
        to: string
    }){
        if(this.board.move.length%2 === 0 && socket !== this.player1)return;
        if(this.board.move.length%2 === 1 && socket !== this.player2)return;

        try{
            this.board.move(move);
        }catch(err){
            console.log(err);
        }

        if(this.board.isGameOver()){
            for(const p of [this.player1,this.player2]){
                p.send(JSON.stringify({
                    type:GAME_OVER,
                    payload:{
                        winner:this.board.turn() === "w" ? "black" : "white",
                    }
                }))
            }
        }
        //update the winner in the database
        if(this.board.moves.length % 2===0 ){
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
    }
        destroy(){
                this.player1.close();
                this.player2.close();
            }
}