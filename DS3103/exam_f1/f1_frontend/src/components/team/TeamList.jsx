import { useState } from "react";
import TeamItem from "./TeamItem";
import TeamService from "../../services/TeamService";
import UpdateTeam from "./UpdateTeam";

const TeamList=({teams, setTeams}) =>{
    const [updatedTeamId, setUpdatedTeamId] = useState({});
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

    //handles delete
    const handleDeleteTeam =async(id) =>{
        try{
            await TeamService.deleteTeam(id);
            const teamsAfterDelete = teams.filter((team=>team.id!==id));
            setTeams(teamsAfterDelete)
        }
        catch(error){
            console.error("error deleting team", error)
        }
    }
    //toggle update form
    const toggleUpdateForm = (team)=>{
        setIsUpdateFormVisible(!isUpdateFormVisible);
        setUpdatedTeamId(team.id);
    }
    //handles update
    const handleUpdateTeam=async(updatedTeam)=>{
        try{
            const teamsAfterUpdate = teams.map((team)=>
                team.id===updatedTeam.id? updatedTeam:team
            );
            setTeams(teamsAfterUpdate);
            setIsUpdateFormVisible(false);
        }
        catch(error) {
            console.error("error updating team")
        }
    }

    return(
        <div className="bg-red-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team=>
            <div 
            className="flex flex-col items-center bg-red-800 py-5 rounded-lg"
            key={team.id}>
                <TeamItem team={team}/>
                    <div className="flex space-x-2">
                    <button
                        onClick={
                            ()=>{if(window.confirm('Are you sure you want to delete team ' + team.manufacturer + '?'))handleDeleteTeam(team.id)}
                        }
                        className="px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-red-500"
                    >
                    Delete Team
                    </button>
                    <button
                        onClick={()=>toggleUpdateForm(team)}
                        className="inline-flex items-center justify-center h-10 px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-blue-800"
                    >
                    Update Team
                    </button>
                    </div>  
                    {isUpdateFormVisible && updatedTeamId===team.id &&(
                        <UpdateTeam 
                            team={team}
                            onUpdateTeam={handleUpdateTeam}
                        />
                    )}
                     
            </div>
            ))}
        </div>
        
        {!teams.length && (
            <p className="text-black-500 font-medium text-lg mt-2">No Teams Found</p>
        )}
        </div>
    )
}
export default TeamList;