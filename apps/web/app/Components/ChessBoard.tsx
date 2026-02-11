"use client"
import { Square,PieceSymbol,Color } from "@repo/common/chess";
import { ChessPieces } from "../config/config";
import { useState } from "react";
import { MOVE } from "@repo/common/config";

export default function ChessBoard({socket,board,color,gameId,userId}:{ // rotating the chessboard and the pieces such that pieces face him 
    socket:WebSocket,
    userId:number,
    gameId:string,
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    color:string,
}){
    const [from,setFrom]=useState('');
    return <div className="w-72 flex flex-col ">
        {
            board && board.map((Square,i)=>{
                return <div className="flex" key={i}> 
                    {
                        Square.map((Box,j)=>{
                            const squarePosition = String.fromCharCode(65+j).toLowerCase()  + (8-i).toString();
                            return <div className={`w-20 h-9 shadow-black flex justify-center items-center  cursor-pointer  ${(i+j)%2 === 0 ? "bg-green-500":"bg-green-200"} text-black`}
                            key={j}
                            onClick={()=>{
                                if(!from && Box?.type){
                                    setFrom(squarePosition);
                                }
                                if(from ){
                                    const to=squarePosition;
                                    if(from === to){
                                        setFrom('');
                                        return;
                                    }
                                    socket.send(JSON.stringify({
                                        type:MOVE,
                                        userId:userId,
                                        gameId:gameId,
                                        payload:{
                                            move:{
                                                from:from,
                                                to:to
                                            }
                                        }
                                    }))
                                    setFrom('');
                                }
                            }}>
                                {
                                    Box?.type&&(
                                        <img src={ChessPieces[Box?.type]?.src}
                                            alt={Box?.type}
                                            className={`w-20 h-9 ${Box?.color==='b'?"" :"invert"}`} />
                                    )
                                }
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}