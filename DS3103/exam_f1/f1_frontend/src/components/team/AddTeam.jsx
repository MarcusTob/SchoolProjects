import { useState } from "react";
import ImageUploadService from "../../services/ImageUploadService";
import TeamService from "../../services/TeamService";

const AddTeam = ({onAddTeam}) => {
    const [image, setImage] = useState(null);
    const [newTeam, setNewTeam] = useState({
        id: 0,
        manufacturer: "",
        driver1: "",
        driver2: "",
        carImage: "",
    })
    const [isAddTeamFormVisible, setIsAddTeamFormVisible] = useState(false);

    //toggles add form
    const toggleAddTeamForm = () => {
        setIsAddTeamFormVisible(!isAddTeamFormVisible);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setNewTeam({...newTeam, carImage: file.name});
    }

    const handleAddNewTeam = async() =>{
        //image upload
        try{
            if(image!=null){
                await ImageUploadService.uploadImage(image);
            }
        }
        catch(error){
            console.error("error uploading image", error);
        }
        //team upload
        try{
            const response = await TeamService.addTeam(newTeam);
            onAddTeam(newTeam);
            setNewTeam({
                id: 0, 
                manufacturer:"", 
                driver1:"", 
                driver2:"", 
                carImage:""});
                //removes form after team is submitted
                setIsAddTeamFormVisible(false);
        }
        catch(error){
            console.error("error adding driver", error)
        }
    }
    return(
        <div
        className="w-2/3 md:w-1/2 lg:w-1/4 bg-black p-2 flex flex-col space-y-2 rounded-lg ">
            <button
                onClick={()=>toggleAddTeamForm()}
                className="inline-flex justify-center items-center max-h-full max-w-full p-3 rounded-lg sm:w-auto sm:max-w-xs px-4 sm:px-8 font-light tracking-wide text-white transition duration-200 bg-black  hover:bg-red-700">
            
            Add A Team
            </button>
            {isAddTeamFormVisible && (
            <div
            className=" p-2 flex flex-col space-y-2 ">
                <p
            className="text-sm text-white">Enter ID</p>
                <input
                    type="text"
                    placeholder="id"
                    value={newTeam.id}
                    onChange={(e)=>setNewTeam({...newTeam, id: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Enter manufacturer</p>      
                <input
                    type="text"
                    placeholder="manufacturer"
                    value={newTeam.manufacturer}
                    onChange={(e)=>setNewTeam({...newTeam, manufacturer: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Enter driver 1</p>
                <input
                    type="text"
                    placeholder="driver 1"
                    value={newTeam.driver1}
                    onChange={(e)=>setNewTeam({...newTeam, driver1: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Driver 2</p>
                <input
                    type="text"
                    placeholder="driver 2"
                    value={newTeam.driver2}
                    onChange={(e)=>setNewTeam({...newTeam, driver2: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Add image</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                >
                </input>
                <div>
                <button
                    onClick={handleAddNewTeam}
                    className="w-full bg-white text-black transition duration-200 hover:bg-blue-700 font-bold p-2 rounded hover:text-white"
                >Add Team</button>
                </div>
            </div>
            )}
        </div>
    )
}
export default AddTeam;