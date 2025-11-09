import { useNavigate } from "react-router-dom";
import chessboard from "../assets/chessboard.jpeg";
import { Button } from "../components/Button";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl">
        
        <div className="flex justify-center">
          <img
            src={chessboard}
            alt="Chessboard"
            className="w-72 md:w-96 rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-white text-2xl font-bold">Welcome to Chess</h1>
            <Button onClick={()=>{
                navigate('/game')
            }} children="Play Chess"/>
        </div>
      </div>
    </div>
  );
};
