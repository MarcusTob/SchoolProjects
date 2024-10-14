import { useState } from "react";
import RaceItem from "./RaceItem";
import RaceService from "../../services/RaceService";
import UpdateRace from "./UpdateRace";

const RaceList=({races, setRaces}) =>{
    const [updatedRaceId, setUpdatedRaceId] = useState({});
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

    const handleDeleteRace =async(id) =>{
        try{
            await RaceService.deleteRace(id);
            const racesAfterDelete = races.filter((race=>race.id!==id));
            setRaces(racesAfterDelete)
        }
        catch(error){
            console.error("error deleting race", error)
        }
    }
    const toggleUpdateForm = (race)=>{
        setIsUpdateFormVisible(!isUpdateFormVisible);
        setUpdatedRaceId(race.id);
    }
    const handleUpdateRace=async(updatedRace)=>{
        try{
            const RacesAfterUpdate = races.map((race)=>
                race.id===updatedRace.id? updatedRace:race
            );
            setRaces(RacesAfterUpdate);
            setIsUpdateFormVisible(false);
        }
        catch(error) {
            console.error("error updating driver")
        }
    }
    
    return(
        <div className="bg-red-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {races.map((race=>
            <div 
            className="flex flex-col items-center bg-red-800 py-5 rounded-lg"
            key={race.id}>
                <RaceItem race={race}/>
                <div className="flex space-x-2">
                    <button
                        onClick={
                            ()=>{if(window.confirm('Are you sure you want to delete the race in ' + race.country + '?'))handleDeleteRace(race.id)}
                        }
                        className="px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-red-500"
                    >
                    Delete Race
                    </button>
                    <button
                        onClick={()=>toggleUpdateForm(race)}
                        className="inline-flex items-center justify-center h-10 px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-blue-800"
                    >
                    Update Race
                    </button>
                    </div>    
                    {isUpdateFormVisible && updatedRaceId===race.id &&(
                        <UpdateRace 
                            race={race}
                            onUpdateRace={handleUpdateRace}
                        />
                    )}
            
            </div>
            ))}
            </div>
        
        {!races.length && (
            <p className="text-black-500 font-medium text-lg mt-2">No Races Found</p>
        )}
        </div>
    )
}
export default RaceList;