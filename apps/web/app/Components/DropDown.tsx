"use client"
import { useState } from "react"
import { Game } from "../helper/types";
interface DropDownProps{
    game: Game,
    index: number
}export const DropDown = ({ game,index }: DropDownProps) => {
  const [open, setOpen] = useState(false);

  async function getGameInfo(id:string){
    // await api()
  }
  return (
    <div className="bg-slate-700 rounded-md overflow-hidden" key={index}>
      <button
        onClick={() => getGameInfo(game.id)}
        className="w-full flex justify-between items-center
                   px-3 py-2 hover:bg-slate-600 transition"
      key={index}>
        <div className="text-left text-sm">
          <p className="font-medium">Game</p>
          <p className="text-gray-400 text-xs">
            {new Date(game.playedAt).toLocaleString()}
          </p>
        </div>

        <span className="text-green-400 text-lg">
          {open ? "↑" : "↓"}
        </span>
      </button>

      {open && (
        <div className="px-3 py-2 border-t border-slate-600 text-sm text-gray-300">
          Game ID: {game.id.slice(0, 8)}
        </div>
      )}
    </div>
  );
};
