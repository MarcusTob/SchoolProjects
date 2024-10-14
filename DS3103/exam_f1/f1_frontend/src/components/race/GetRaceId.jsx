import { useState } from "react";

const GetRaceId = ({onGetRace}) =>{
    const [raceId, setRaceId] = useState("");
    const [isGetRaceFormVisible, setIsGetRaceFormVisible] = useState("");

    const toggleGetRaceForm = () => {
        setIsGetRaceFormVisible(!isGetRaceFormVisible);
    }
    const handleGetRaceId = () =>{
        onGetRace(raceId);
        setRaceId("");
    }

    return(
        <div
        className="w-2/3 md:w-1/2 lg:w-1/4 bg-black p-2 flex flex-col space-y-2 rounded-lg">
            <button
                    onClick={()=>toggleGetRaceForm()}
                    className="inline-flex items-center justify-center max-h-full max-w-full p-3 rounded-lg sm:w-auto sm:max-w-xs px-4 sm:px-8 font-light tracking-wide text-white transition duration-200 bg-black  hover:bg-red-700"
            >
                Search For A Race ID
            </button>
        {isGetRaceFormVisible && (
        <div className=" p-2 flex flex-col space-y-2">
            <p
                className="text-sm text-white">Enter or choose a race ID</p>
            <input 
                type="number"
                placeholder="Race ID"
                value={raceId}
                onChange={(e) => setRaceId(e.target.value)}
                className="w-full p-2 border-gray-300 rounded"

            />
            <button
                onClick={handleGetRaceId}
                className="w-full bg-white text-black transition duration-200 hover:bg-blue-700 font-bold p-2 rounded hover:text-white"
            >
            Get Race By Id
            </button>
        </div>
    )}
    </div>
    )
}
export default GetRaceId;