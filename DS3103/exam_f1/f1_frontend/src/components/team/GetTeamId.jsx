import { useState } from "react";

const GetTeamId = ({onGetTeam}) =>{
    const [teamId, setTeamId] = useState("");
    const [isGetTeamFormVisible, setIsGetTeamFormVisible] = useState("");

    const toggleGetTeamForm = () => {
        setIsGetTeamFormVisible(!isGetTeamFormVisible);
    }
    const handleGetTeamId = () =>{
        onGetTeam(teamId);
        setTeamId("");
    }

    return(
        <div
        className="w-2/3 md:w-1/2 lg:w-1/4 bg-black p-2 flex flex-col space-y-2 rounded-lg ">
            <button
                    onClick={()=>toggleGetTeamForm()}
                    className="inline-flex items-center justify-center max-h-full max-w-full p-3 rounded-lg sm:w-auto sm:max-w-xs px-4 sm:px-8 font-light tracking-wide text-white transition duration-200 bg-black  hover:bg-red-700"
            >
                Search For A Team ID
            </button>
        {isGetTeamFormVisible && (
        <div
        className=" p-2 flex flex-col space-y-2">
            <p
            className="text-sm text-white">Enter or choose a driver ID</p>
            <input 
                type="number"
                placeholder="Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full p-2 border-gray-300 rounded"

            />
            <button
                onClick={handleGetTeamId}
                className="w-full bg-white text-black transition duration-200 hover:bg-blue-700 font-bold p-2 rounded hover:text-white"
                >
            Get Team By Id
            </button>
        </div>
    )}
    </div>
    )
}
export default GetTeamId;