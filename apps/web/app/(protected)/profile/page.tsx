"use client";
import { useEffect, useState } from "react";
import { api } from "../../helper/api";
import { ProfileType } from "../../helper/types";
import { useRouter } from "next/navigation";
import { DropDown } from "../../Components/DropDown";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchProfile() {
      await api("/user/profile", { method: "GET" })
        .then((data) => {
          console.log(data);
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
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
          <h1 className="text-lg font-semibold">{profile.username}</h1>
          <p className="text-green-400 font-bold">🏆 {profile.points}</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-wide">Games</h2>
          {profile.games.length > 0 ? (
            profile.games.map((game, i) => <DropDown game={game} index={i} />)
          ) : (
            <div className="text-center">No games found</div>
          )}
        </div>
      </div>
    </div>
  );
}
