import axios from "axios";

const RaceService = (() => {
    const raceUrl = "http://localhost:5056/FormulaOne/races";

    const getAllRaces = async () => {
        try {
            const response = await axios.get(raceUrl);
            return response.data;
        }
        catch (error) {
            console.error("error getting race", error);
        }
    }

    const addRace = async (newRace) => {
        try {
            const response = await axios.post(raceUrl, newRace);
        }
        catch (error) {
            console.error("error adding driver", error.response.data)
        }
    }

    const updateRace = async (updatedRace) =>{
        try{
            const response = await axios.put(`${raceUrl}/${updatedRace.id}`, updatedRace);
        }
        catch(error){
            console.error("error updating race", error);
        }
    }
    const deleteRace = async (id) =>{
        try{
            await axios.delete(`${raceUrl}/${id}`);
        }
        catch(error){
            console.error("error deleting race");
        }
        
    }

    return {
        getAllRaces,
        addRace,
        updateRace,
        deleteRace
    }
})();
export default RaceService;