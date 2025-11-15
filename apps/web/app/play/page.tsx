"use client"
import { Button } from "@repo/ui/button";
import ChessBoard from "../Components/ChessBoard";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import {ERROR, INIT_GAME,MOVE} from '@repo/common/config'
import Chess from "@repo/common/chess";

export default function Play(){
    const [chess,setChess]=useState<Chess>(new Chess());
    const [board,setBoard]=useState(chess.board());
    const [isStarted,setStarted]=useState(false);
    const [color,setColor]=useState("");
    const [socket,setSocket]=useState<WebSocket|null>(null);
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
            switch(message.type){
                case INIT_GAME:
                    setStarted(true);
                    setColor(message.color);
                    break;
                case MOVE:
                    const move = message.payload.move;
                    chess.move(move);
                    setBoard(chess.board);
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

    if(!socket) return <div>Loading...</div>
    
    return (
        <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
            <div className="flex">
                <ChessBoard board={board} socket={socket}/>
                {
                    isStarted?(
                        <div className="bg-gray-700">
                            <h1 className="text-white">Your pieces are {color}</h1>
                        </div>
                    ):(
                        <div>
                            <Button children="Play"  onClick={()=>initGame()}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
}