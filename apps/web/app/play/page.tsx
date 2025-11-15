"use client"
import { Button } from "@repo/ui/button";
import ChessBoard from "../Components/ChessBoard";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import {INIT_GAME,MOVE} from '@repo/common/config'
import Chess from "@repo/common/chess";

export default function Play(){
    const [isStarted,setStarted]=useState(false);
    const [color,setColor]=useState("");
    const [socket,setSocket]=useState<WebSocket|null>(null);
    const [board,setBoard]=useState<Chess>(new Chess());
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
            const message=JSON.parse(data);
            switch(message.type){
                case INIT_GAME:
                    setStarted(true);
                    setColor(message.color);
                    break;
                case MOVE:
                    
            }
        }
        return ()=>{
            socket?.close();
        }
    },[socket])
    function sendMessage(){
        if(!socket)return;
        socket.send(JSON.stringify({
            type:INIT_GAME
        }))
    }
    return (
        <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
            <div className="flex">
                <ChessBoard/>
                {
                    isStarted?(
                        <div className="bg-gray-700">
                            <h1 className="text-white">Moves</h1>
                        </div>
                    ):(
                        <Button children="Play" onClick={()=>sendMessage}/>
                    )
                }
            </div>
        </div>
    );
}