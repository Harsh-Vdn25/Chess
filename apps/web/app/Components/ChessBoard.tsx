import { Square,PieceSymbol,Color } from "@repo/common/chess";

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
                            return <div className={`w-8 h-8 border-1 border-gray-500 ${j%2 === 0 ? "bg-green-500":"bg-green-100"} text-black`}
                            >{Box?.type}</div>
                        })
                    }
                </div>
            })
        }
    </div>
}