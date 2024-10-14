import { useState } from "react";
import RaceService from "../../services/RaceService";

const AddRace = ({ onAddRace }) => {
    const [newRace, setNewRace] = useState({
      id: 0,
      winnerName: "",
      winnerTime: "",
      country: "",
      numberOfLaps: 0
    });
    const [isAddRaceFormVisible, setIsAddRaceFormVisible] = useState(false);

    //toggles add form
    const toggleAddRaceForm = () => {
      setIsAddRaceFormVisible(!isAddRaceFormVisible);
    }

    const handleAddNewRace = async () => {
      //upload race
      try {
        const response = await RaceService.addRace(newRace);
        onAddRace(newRace);
        setNewRace({
          id: 0,
          winnerName: "",
          winnerTime: "",
          country: "",
          numberOfLaps: 0
        });
        //removes add form after race is submitted
        setIsAddRaceFormVisible(false);
      } 
      catch (error) {
        console.error("error adding race", error);
      }
    };
  return (
    <div 
    className="w-2/3 md:w-1/2 lg:w-1/4 bg-black p-2 flex flex-col space-y-2 rounded-lg ">
      <button
        onClick={()=>toggleAddRaceForm()}
        className="inline-flex justify-center items-center max-h-full max-w-full p-3 rounded-lg sm:w-auto sm:max-w-xs px-4 sm:px-8 font-light tracking-wide text-white transition duration-200 bg-black  hover:bg-red-700"
      >
      Add A Race
      </button>
      {isAddRaceFormVisible && (
      <div className=" p-2 flex flex-col space-y-2 ">
        <p
            className="text-sm text-white">Enter ID</p>
        <input
          type="text"
          placeholder="id"
          value={newRace.id}
          onChange={(e) => setNewRace({ ...newRace, id: e.target.value })}
          className="w-full p-2 border-gray-300 rounded"
        ></input>
        <p
          className="text-sm text-white">Enter Winners Name</p>
        <input
          type="text"
          placeholder="Winner Name"
          value={newRace.winnerName}
          onChange={(e) => setNewRace({ ...newRace, winnerName: e.target.value })}
          className="w-full p-2 border-gray-300 rounded"
        ></input>
        <p
          className="text-sm text-white">Enter Winners Time</p>        
        <input
          type="text"
          placeholder="Winner time"
          value={newRace.winnerTime}
          onChange={(e) => setNewRace({ ...newRace, winnerTime: e.target.value })}
          className="w-full p-2 border-gray-300 rounded"
        ></input>
        <p
          className="text-sm text-white">Enter Country</p>
        <input
          type="text"
          placeholder="country"
          value={newRace.country}
          onChange={(e) => setNewRace({ ...newRace, country: e.target.value })}
          className="w-full p-2 border-gray-300 rounded"
        ></input>
        <p
          className="text-sm text-white">Enter Number of Laps</p>
        <input
          type="text"
          placeholder="number of laps"
          value={newRace.numberOfLaps}
          onChange={(e) => setNewRace({ ...newRace, numberOfLaps: e.target.value })}
          className="w-full p-2 border-gray-300 rounded"
        ></input>
        <button
          onClick={handleAddNewRace}
          className="w-full bg-white text-black transition duration-200 hover:bg-blue-700 font-bold p-2 rounded hover:text-white"
        >
          Add Race
        </button>
      </div>
      )}
    </div>
  );
};
export default AddRace;
