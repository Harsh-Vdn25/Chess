import WebSocket from "ws";
import Chess from "@repo/common/chess";
import { MOVE,ERROR,INIT_GAME, GAME_OVER } from "@repo/common/config";
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
        if(this.chess.isCheckmate()) return;
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
            let message;
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