import { useEffect, useState } from "react"

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'GAME_OVER';

export const useSocket=()=>{
    const [socket,setSocket]=useState<WebSocket|null>();
    const WS_URL="ws://localhost:5001"

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen=()=>{
            console.log("Connected");
            setSocket(ws);
        }

        ws.onclose=()=>{
            setSocket(null);
        }
        return ()=>{
            ws.close();
            setSocket(null);
        }
    },[])

    return socket;
}