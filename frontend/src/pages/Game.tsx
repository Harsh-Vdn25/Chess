import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import ChessBoard from "../components/ChessBoard"
import { GAME_OVER, INIT_GAME, MOVE, useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const Game = () => {
  const socket=useSocket();
  const [board,setBoard]=useState<Chess>();
  useEffect(()=>{
    if(!socket) return;

    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      switch (message.type){
        case INIT_GAME:
          setBoard(new Chess());
          console.log("Game initialized");
          break;
        case MOVE:
          const move= message.payload;
          board?.move(move);
          console.log("Move made"); 
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
      }
    }
  },[socket]);

  if(!socket) return <div>Loading...</div>
  return (
    <div className="w-screen h-screen bg-gray-600 flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <ChessBoard/>
        </div>
        <div>
          <Button children="" onClick={()=>{
            socket?.send(JSON.stringify({
              type:"init_game"
            }))
          }}/>
        </div>
      </div>
    </div>
  )
}
