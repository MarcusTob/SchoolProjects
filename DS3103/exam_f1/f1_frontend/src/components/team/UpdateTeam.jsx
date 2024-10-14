import { useState } from "react";
import ImageUploadService from "../../services/ImageUploadService";
import TeamService from "../../services/TeamService";

const UpdateTeam = ({team, onUpdateTeam}) => {
    const [updatedImage, setUpdatedImage] = useState(null);
    const [updatedTeam, setUpdatedTeam] = useState ({
        id: team.id,
        manufacturer: team.manufacturer,
        driver1: team.driver1,
        driver2: team.driver2,
        carImage: team.carImage
    })
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setUpdatedImage(file);
        setUpdatedTeam({...updatedTeam, carImage: file.name});
    }

    const handleUpdateTeam = async () => {
        try{
            if(updatedImage!=null){
                await ImageUploadService.uploadImage(updatedImage);
            }
            const response = await TeamService.updateTeam(updatedTeam);
            onUpdateTeam(updatedTeam);
        }
        catch(error){
            console.error("error updating team", error);
        }
    }

    return(
        <div  className="p-2 flex flex-col space-y-2 ">
            {/* id not presented as a choice because id cannot be changed */}
            <input
                type="text"
                placeholder="Manufacturer"
                value={updatedTeam.manufacturer}
                onChange={(e) => setUpdatedTeam({...updatedTeam, manufacturer: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="text"
                placeholder="Driver 1"
                value={updatedTeam.driver1}
                onChange={(e) => setUpdatedTeam({...updatedTeam, driver1: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="text"
                placeholder="Driver 2"
                value={updatedTeam.driver2}
                onChange={(e) => setUpdatedTeam({...updatedTeam, driver2: e.target.value})}
                className="w-full p-2 border-gray-300 rounded"
            >
            </input>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border-gray-300 rounded"    
            >
            </input>
            <button
                onClick={handleUpdateTeam}
                className="inline-flex items-center justify-center h-10 px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-blue-800"
            >
                Update Team
            </button>
        </div>
    )

}
export default UpdateTeam;