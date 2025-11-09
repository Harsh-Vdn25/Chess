import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import ChessBoard from "../components/ChessBoard"
import { GAME_OVER, INIT_GAME, MOVE, useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const Game = () => {
  const socket=useSocket();
  const [chess,setChess]=useState<Chess>(new Chess());
  const [board,setBoard]=useState(chess?.board());//board is a 2D array
  useEffect(()=>{
    if(!socket) return;
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      switch (message.type){
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          console.log("Game initialized");
          break;
        case MOVE:
          const move= message.payload;
          chess?.move(move);
          setBoard(chess?.board());//Set the board as pieces moved to new positions
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
          <ChessBoard board={board}/>
        </div>
        <div>
          <Button children="Play" onClick={()=>{
            socket?.send(JSON.stringify({
              type:"init_game"
            }))
          }}/>
        </div>
      </div>
    </div>
  )
}