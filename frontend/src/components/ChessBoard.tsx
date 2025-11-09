import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../hooks/useSocket";

interface BoardType {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export default function ChessBoard({
  board,
  socket
}: {
  board: (BoardType | null)[][],
  socket:WebSocket
}) {

  const [from,setFrom]=useState<String|null>();
  const [to,setTo]=useState<String|null>();

  return <div className="flex flex-col ">
    {board && board.map((row,i)=>{
            return <div key={i} className="flex ">
                {
                    row.map((square,j)=>{
                      const rank =8-i;
                      const squarePostion=String.fromCharCode(65+(Math.floor(j%8))).toLowerCase() + "" + rank;
                    return <div key={j} 
                    onClick={()=>{
                      if(!from){
                        setFrom(squarePostion)
                      }else{
                        setTo(squarePostion);
                        const moveTo = squarePostion;
                        socket.send(JSON.stringify({
                          type:MOVE,
                          move:{
                            from:from,
                            to:moveTo
                          }
                        }))
                        setFrom(null);
                      }
                    }}
                    className={`w-10 h-10 px-2 py-1 flex justify-center items-center cursor-pointer ${(i+j)%2 === 0 ? 'bg-green-500' : 'bg-white'}`}>
                        {square ? square.type : ''}
                    </div>
                })
                }
            </div>
        })
    }
  </div>;
}