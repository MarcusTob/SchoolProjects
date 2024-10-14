import axios from "axios";

const TeamService= (()=>{
    const teamUrl = "http://localhost:5056/FormulaOne/teams";

    const getAllTeams = async() =>{
        try{
            const response = await axios.get(teamUrl);
            return response.data;
        }
        catch(error){
            console.error("error geting teams", error);
        }
    }

    const addTeam = async (newTeam) => {
        try{
            const response = await axios.post(teamUrl, newTeam);
        }
        catch(error){
            console.error("error adding team", error)
        }
    }

    const updateTeam = async(updatedTeam) =>{
        try{
            const response = await axios.put(`${teamUrl}/${updatedTeam.id}`, updatedTeam);
        }
        catch(error){
            console.error("error updating team", error);
        }
    }

    const deleteTeam = async(id) =>{
        try{
            await axios.delete(`${teamUrl}/${id}`);
        }
        catch(error){
            console.error("error deleting team", error);
        }
    }

    return{
        getAllTeams,
        addTeam,
        updateTeam,
        deleteTeam
    }
}
)();
export default TeamService;