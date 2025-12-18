"use client"
import { Button } from "@repo/ui/button";
import ChessBoard from "../Components/ChessBoard";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import {ERROR, GAME_OVER, INIT_GAME,MOVE, REJOIN} from '@repo/common/config'
import Chess from "@repo/common/chess";
import {useRouter} from "next/navigation";

export default function Play(){
    const [chess,setChess]=useState<Chess>(new Chess());
    const [board,setBoard]=useState(chess.board());
    const [isStarted,setStarted]=useState(false);
    const [color,setColor]=useState("");
    const [socket,setSocket]=useState<WebSocket|null>(null);
    const [isGameOver,setIsGameOver]=useState(false);
    const [colorWon,setColorWon]=useState('');
    const router = useRouter();
    useEffect(()=>{
        if(socket)return;
        useSocket({socket,setSocket});
        return ()=>{
            setSocket(null);
        }
    },[])

    useEffect(()=>{
        if(!socket)return;
        socket.onmessage=(data :any)=>{
            const msgData=data.data;
            const message=JSON.parse(msgData);
            let move;
            switch(message.type){
                case INIT_GAME:
                    setStarted(true);
                    setColor(message.payload.color);
                    break;
                case MOVE:
                    move = message.payload.move;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                case GAME_OVER:
                    move = message.payload.move;
                    const Winner = message.payload.winner;
                    chess.move(move);
                    setBoard(chess.board());
                    setIsGameOver(true);
                    setColorWon(Winner);
                    alert(Winner);
                    break;
                case REJOIN:
                    console.log(message.payload.Board[0]);
                    const board = message.payload.Board[0];
                    setBoard(board);
                    break;
                case ERROR:
                    alert(message.payload.message)
                    break;
                
            }
        }
        return ()=>{
            socket?.close();
        }
    },[socket])

    function initGame(){
        if(!socket)return;
        socket.send(JSON.stringify({
            type:INIT_GAME
        }))
    }

    if(!socket) return <div>Loading....</div>
    
    return (
        <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
            <div className="flex">
                <ChessBoard board={board} socket={socket}/>
                <div className="bg-gray-700">
                {
                    isStarted?(
                        isGameOver?(
                            <h1 className="text-white">{colorWon}</h1>
                        ):(
                            <h1 className="text-white">Your pieces are {color}</h1>
                        )
                    ):(
                        <div>
                            <Button children="Play"  onClick={()=>initGame()}/>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    );
}