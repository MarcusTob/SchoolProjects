import { useState, useEffect } from "react";
import TeamService from "../services/TeamService";
import AddTeam from "../components/team/AddTeam";
import TeamList from "../components/team/TeamList";
import GetTeamId from "../components/team/GetTeamId";

const TeamPage =() =>{
    const [teams, setTeams] = useState([]);

    const getAllTeams = async()=>{
        const response = await TeamService.getAllTeams();
        setTeams(response);
    }
    const addTeam = (newTeam) => {
        setTeams([...teams, newTeam]);
    }
    const getTeamById = async (id) => {
        const targetTeam = teams.find((team) =>
            team.id === parseInt(id)
        );
        if(targetTeam != null) {
            setTeams([targetTeam]);
        }
        else{
            setTeams([]);
        }
    }
    useEffect(()=>{
        getAllTeams();
    }, []);

    return(
        <div className="container mx-auto">
            <h1 className="mb-4 text-3xl font-extrabold text-red-700 md:text-5xl lg:text-6xl">F1 TEAMS</h1>
            <div className="container">
                <div className="bg-white py-4 p-7">
                    <section className="flex justify-between">
                        <AddTeam onAddTeam={addTeam} />
                        <GetTeamId onGetTeam={getTeamById} />
                    </section>
                </div>
            </div>
            <div>
                <TeamList teams={teams} setTeams={setTeams} />
            </div>
        </div>


    )

}
export default TeamPage;