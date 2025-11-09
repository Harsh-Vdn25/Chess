import type { Color, PieceSymbol, Square } from "chess.js";

interface BoardType {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export default function ChessBoard({
  board,
}: {
  board: (BoardType | null)[][];
}) {
  return <div className="flex flex-col ">
    {board && board.map((row,i)=>{
            return <div key={i} className="flex ">
                {
                    row.map((square,j)=>{
                    return <div key={square?.square} className={`w-8 h-8 px-2 py-1 flex justify-center items-center ${(i+j)%2 === 0 ? 'bg-green-500' : 'bg-green-300'}`}>
                        {square ? square.type : ''}
                    </div>
                })
                }
            </div>
        })
    }
  </div>;
}