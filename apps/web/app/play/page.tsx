"use client"
import { Button } from "@repo/ui/button";
import ChessBoard from "../Components/ChessBoard";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import { ERROR, GAME_OVER, INIT_GAME,MOVE, REJOIN, TOKEN_ERROR} from '@repo/common/config'
import Chess from "@repo/common/chess";
import { refreshToken } from "../helper/api";
import { useRouter } from "next/navigation";

export default  function Play(){
    const [chess,setChess]=useState<Chess>(new Chess());
    const [board,setBoard]=useState(chess.board());
    const [userId,setUserId] = useState(0);
    const [gameId,setGameId]=useState('');
    const [isStarted,setStarted]=useState(false);
    const [color,setColor]=useState('');
    const [isGameOver,setIsGameOver]=useState(false);
    const [colorWon,setColorWon]=useState('');
    let socket = useSocket();
    const router = useRouter();

    function ChangePiecePos(move:{
        from:string,
        to:string
    }){
        setChess(prev => {
            const newChess=new Chess(prev.fen());
            newChess.move(move);
            setBoard(newChess.board());
            return newChess;
        });
    }

    useEffect(()=>{
        if(!socket){
            const timer = setTimeout(()=>{
                router.push('/signin')
            },3000)
            return ()=>clearTimeout(timer);
        }
        socket.onmessage=async (data :any)=>{
            const msgData=data.data;
            const message=JSON.parse(msgData);
            let move:{from:string,to:string};
            switch(message.type){
                case INIT_GAME:
                    setStarted(true);
                    setColor(message.payload.color);
                    setGameId(message.gameId);
                    setUserId(message.userId);
                    break;
                case MOVE:
                    move = message.payload.move;
                    ChangePiecePos(move);
                    break;
                case GAME_OVER:
                    move = message.payload.move;
                    const Winner = message.payload.winner;
                    ChangePiecePos(move);
                    setIsGameOver(true);
                    setColorWon(Winner);
                    alert(Winner);
                    break;
                case REJOIN:
                    const FEN = message.payload.FEN
                    const newChess = new Chess(FEN);
                    setChess(newChess);
                    setBoard(newChess.board());
                    break;
                case ERROR:
                    alert(message.payload.message);
                    break;
                case TOKEN_ERROR:
                    const token = await refreshToken();
                    if(!token){
                        return router.push('/signin');
                    }
                    window.location.reload();
                    break;
            }
        }
        return ()=>{
            socket?.close();
        }
    },[socket])

    function initGame(){
        if(!socket)return;
        socket.send(JSON.stringify({
            type:INIT_GAME
        }))
    }

    if(!socket) {
        return <div>Loading....</div>
    }
    
    return (
        <div className="w-screen h-screen bg-gray-800 flex justify-center items-center">
            <div className="flex">
                <ChessBoard board={board} socket={socket} 
                    color={color} gameId={gameId} userId={userId}/>
                <div className="bg-gray-700">
                {
                    isStarted?(
                        isGameOver?(
                            <h1 className="text-white">{colorWon}</h1>
                        ):(
                            <h1 className="text-white">Your pieces are {color}</h1>
                        )
                    ):(
                        <div>
                            <Button children="Play"  onClick={()=>initGame()}/>
                        </div>
                    )
                }
                </div>
            </div>
        </div>
    );
}