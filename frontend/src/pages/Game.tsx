import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import ChessBoard from "../components/ChessBoard"
import { GAME_OVER, INIT_GAME, MOVE, useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const Game = () => {
  const socket=useSocket();
  const [chess,setChess]=useState<Chess>(new Chess());
  const [board,setBoard]=useState(chess?.board());//board is a 2D array
  const [isStarted,setIsStarted]=useState(false);
  useEffect(()=>{
    if(!socket) return;
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      switch (message.type){
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess?.board());
          setIsStarted(true);
          console.log("Game initialized");
          break;
        case MOVE:
          console.log(message);
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
      <div className="w-full max-w-5xl grid grid-cols-5 gap-4 p-6">
        <div className="col-start-2 col-end-4">
          <ChessBoard socket={socket} board={board}/>
        </div>
        <div className="ml-3 col-start-4 col-end-5 bg-gray-700 ">
          {
            isStarted?(
              <div className="flex ">
              </div>
            ):(
              <div className="mt-3 justify-center">
                <Button children="Play" onClick={()=>{
                socket?.send(JSON.stringify({
                  type:"init_game"
                }))
              }}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}