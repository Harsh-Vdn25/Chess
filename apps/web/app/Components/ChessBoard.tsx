import { Square,PieceSymbol,Color } from "@repo/common/chess";
import { ChessPieces } from "../config/config";

export default function ChessBoard({socket,board}:{
    socket:WebSocket,
    board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][]
}){
    return <div className="w-72 flex flex-col ">
        {
            board && board.map((Square,i)=>{
                return <div className="flex"> 
                    {
                        Square.map((Box,j)=>{
                            return <div className={`w-8 h-8 shadow-black flex justify-center items-center  cursor-pointer ${(i+j)%2 === 0 ? "bg-green-500":"bg-green-200"} text-black`}
                            >
                                {
                                    Box?.type&&(
                                        <img src={ChessPieces[Box?.type]?.src}
                                            alt={Box?.type}
                                            className={`w-8 h-8 ${Box?.color==='b'?"invert" :""}`} />
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