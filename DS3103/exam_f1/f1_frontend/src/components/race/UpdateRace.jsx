import { useState } from "react";
import RaceService from "../../services/RaceService";

const UpdateRace = ({race, onUpdateRace}) => {
    const [updatedImage, setUpdatedImage] = useState(null);
    const [updatedRace, setUpdatedRace] = useState({
        id: race.id,
        winnerName: race.winnerName,
        winnerTime: race.winnerTime,
        country: race.country,
        numberOfLaps: race.numberOfLaps
    })

    const handleUpdateRace = async () => {
        try{
            const response = await RaceService.updateRace(updatedRace);
            onUpdateRace(updatedRace);
        }
        catch(error){
            console.error("error updating race", error);
        }
    }

    return(
        <div className=" p-2 flex flex-col space-y-2 ">
            {/* id not presented as a choice because id cannot be changed */}
            <input
                type="text"
                placeholder="winners name"
                value={updatedRace.winnerName}
                onChange={(e) => setUpdatedRace({...updatedRace, winnerName: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="text"
                placeholder="winners time"
                value={updatedRace.winnerTime}
                onChange={(e) => setUpdatedRace({...updatedRace, winnerTime: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="text"
                placeholder="country"
                value={updatedRace.country}
                onChange={(e) => setUpdatedRace({...updatedRace, country: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="text"
                placeholder="Number of Laps"
                value={updatedRace.numberOfLaps}
                onChange={(e) => setUpdatedRace({...updatedRace, numberOfLaps: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <button
                onClick={handleUpdateRace}
                className="inline-flex items-center justify-center h-10 px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-blue-800"
            >
                Update Race
            </button>
        </div>
    )
}
export default UpdateRace;