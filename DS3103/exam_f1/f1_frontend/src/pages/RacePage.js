import { useState, useEffect } from "react";
import RaceService from "../services/RaceService";
import AddRace from "../components/race/AddRace";
import RaceList from "../components/race/RaceList";
import GetRaceId from "../components/race/GetRaceId";

const RacePage = () => {
    const [races, setRaces] = useState([]);

    const getAllRaces = async () => {
        const response = await RaceService.getAllRaces();
        setRaces(response);
    }
    const addRace = (newRace) => {
        setRaces([...races, newRace]);
    }
    const getRaceById = async (id) => {
        const targetRace = races.find((race) =>
            race.id === parseInt(id)
        );
        if(targetRace != null) {
            setRaces([targetRace]);
        }
        else{
            setRaces([]);
        }
    }
    useEffect(() => {
        getAllRaces();
    }, []);

    return (
        <div className="container mx-auto ">
            <h1 className="mb-4 text-3xl font-extrabold text-red-700 md:text-5xl lg:text-6xl">F1 RACES</h1>
            <div className="container">
                <div className="bg-white py-4 p-7">
                    <section className="flex justify-between">
                        <AddRace onAddRace={addRace} />
                        <GetRaceId onGetRace={getRaceById}/>
                    </section>
                </div>
            </div>

            <div>
                <RaceList races={races} setRaces={setRaces} />
            </div>
        </div>
    )
}
export default RacePage;