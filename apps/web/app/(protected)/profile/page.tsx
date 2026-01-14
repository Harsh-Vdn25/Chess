"use client";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ProfileType } from "../../helper/types";
import { DropDown } from "../../Components/DropDown";
import { useAuth } from "../../context/AuthContext";
import NoDP from "../../assets/nodp.png";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const { api } = useAuth();
  useEffect(() => {
    async function fetchProfile() {
      await api("/user/profile", { method: "GET" })
        .then((data: SetStateAction<ProfileType | null>) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err: any) => console.error(err));
    }
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );

  if (!profile)
    return <p className="text-center text-red-500">No profile found</p>;

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-6 text-gray-100">
      <div className="w-full max-w-4xl bg-gray-600 p-6 grid grid-rows-2 rounded-md shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold">{profile.username}</h1>
            <p
              className={`${profile.points <= 0 ? "text-red-500" : "text-green-500"} text-md font-extrabold`}
            >
              🏆 {profile.points}
            </p>
            <div className="flex gap-3">
              <p className="font-bold">Wins: {profile.wins}</p>
              <p className="font-bold">Losses: {profile.losses}</p>
              <p className="font-bold">WinRate: {profile.winRate}</p>
            </div>
          </div>
          <div className="flex">
            <Image
              src={profile.Avatar ? profile.Avatar : NoDP}
              height={110}
              width={110}
              alt="avatar"
              className="rounded-full border-2 border-gray-800  object-cover"
            />
          </div>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <h2 className="text-lg text-center font-semibold tracking-wide mb-4">
            Games
          </h2>

          {profile.games.length > 0 ? (
            <div className="space-y-3">
              {profile.games.map((game, i) => (
                <DropDown key={i} game={game} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">No games found</div>
          )}
        </div>
      </div>
    </div>
  );
}
