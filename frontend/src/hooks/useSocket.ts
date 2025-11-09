import { useEffect, useRef } from "react"

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'GAME_OVER';

export const useSocket=()=>{
    const socketRef=useRef<WebSocket|null>(null);
    const WS_URL="ws://localhost:5001"

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen=()=>{
            console.log("Connected");
            socketRef.current=ws;
        }

        ws.onclose=()=>{
            socketRef.current=null;
        }
        return ()=>{
            ws.close();
        }
    },[])
    return socketRef.current;
}