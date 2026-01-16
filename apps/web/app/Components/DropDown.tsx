"use client";
import { useState } from "react";
import { Game } from "../helper/types";
import { useAuth } from "../context/AuthContext";

interface DropDownProps {
  game: Game;
}

interface Verdict {
  winner: { username: string; points: number };
  loser: { username: string; points: number };
}

export const DropDown = ({ game }: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const { api } = useAuth();

  async function toggleDropdown() {
    setOpen((prev) => !prev);

    if (!verdict && !loading) {
      try {
        setLoading(true);
        const res = await api(`/game/verdict?gameId=${game.id}`, {
          method: "GET",
        });
        setVerdict(res);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="bg-slate-700 rounded-md overflow-hidden">
      {/* Header */}
      <button
        onClick={toggleDropdown}
        className="w-full flex justify-between items-center
                   px-4 py-3 hover:bg-slate-600 transition"
      >
        <div className="text-left">
          <p className="font-medium text-sm">Game</p>
          <p className="text-gray-400 text-xs">
            {new Date(game.playedAt).toLocaleString()}
          </p>
        </div>

        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-4 py-3 border-t border-slate-600 space-y-3 text-sm">
          {loading && (
            <p className="text-gray-400 animate-pulse">Loading result…</p>
          )}

          {verdict && (
            <>
              <div className="flex justify-between items-center bg-green-900/30 rounded-md px-3 py-2">
                <div>
                  <p className="text-green-400 font-semibold">Winner</p>
                  <p>{verdict.winner.username}</p>
                </div>
                <p className="text-green-400 font-bold">
                  +{verdict.winner.points}
                </p>
              </div>

              <div className="flex justify-between items-center bg-red-900/30 rounded-md px-3 py-2">
                <div>
                  <p className="text-red-400 font-semibold">Loser</p>
                  <p>{verdict.loser.username}</p>
                </div>
                <p className="text-red-400 font-bold">
                  {verdict.loser.points}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Game ID: {game.id.slice(0, 8)}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
