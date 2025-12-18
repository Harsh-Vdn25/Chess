"use client"
import { useRouter } from "next/navigation"
import Chessboard from './assets/chessboard1.jpeg'
import { Button } from "../../../packages/ui/src/button";
import { useEffect } from "react";
import { refreshToken } from "./helper/api";
export default function MainPage(){
  const router=useRouter();
  useEffect(()=>{
    const saved = localStorage.getItem("Token");
    //@ts-ignore
    if(saved)window.__accessToken = saved;
    else refreshToken();
  },[])
  function check(){
    //@ts-ignore
    const token = window.__accessToken;
    if(!token){
      router.push('/signin');
      return ;
    }
    router.push('/play');
  }
  return (
    <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
      <div className="flex gap-4">
        <div className="border-4 rounded-lg border-gray-700">
          <img
            src={Chessboard.src ?? Chessboard} 
            alt="chessboard"
            className="w-72"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <h1 className=" text-3xl font-semibold text-white">Welcome to Chess</h1>
          <Button children="Play Chess" onClick={()=>check()}/>
        </div>
      </div>
    </div>
  )
}