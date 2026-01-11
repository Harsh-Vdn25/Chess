"use client"
import { useEffect, useState } from "react";
import { api, refreshToken } from "../helper/api";
import { ProfileType } from "./types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

    useEffect(()=>{
        async function fetchProfile(){
        let accessToken = localStorage.getItem("Token");
        if(!accessToken){
            const token = await refreshToken();
            if(!token){
               return router.push('/signin')
            }
        }
        accessToken = localStorage.getItem("Token");
        await api('/user/profile',{method:"GET"},accessToken !)
        .then(data=>{
            setProfile(data)
            setLoading(false)
        })
        .catch(err=>console.log(err));
    }
        fetchProfile();
    },[]);
     if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );

  if (!profile)
    return <p className="text-center text-red-500">No profile found</p>;

  return (
    <div className=" h-screen bg-gray-700  flex justify-center items-center p-6">
        <div className="w-3xl p-3 grid grid-rows-2 rounded-md shadow-lg ">
            <div className="grid grid-cols-2 ">
                <h1 className="">{profile.username}</h1>
                <p>🏆{profile.points}</p>
            </div>
            <div className="">
                <h1>Games</h1>
                {
                    profile.games.length>0 ? (
                        <div>{profile.games.length}</div>
                    ):(
                        <div className="text-center">No games found</div>
                    )
                }
            </div>
        </div>
    </div>
  );
}
