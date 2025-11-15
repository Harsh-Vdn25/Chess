import {Chess} from 'chess.js';
import WebSocket from 'ws';
import { Game } from './Game';
import {INIT_GAME, MOVE} from '@repo/common/config'
export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket|null;
    private users: WebSocket[];
    constructor(){
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
   
    addUser(socket:WebSocket){
        this.users.push(socket);
    }
    handleMessage(socket:WebSocket){
        socket.on('message',(data : any)=>{
            const x= data.toString();
            const message = JSON.parse(x);
            if(message.type === INIT_GAME){
                 if(this.pendingUser === null){
                    this.pendingUser = socket;
                 }else{
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