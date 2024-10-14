import { useState } from "react";
import ImageUploadService from "../../services/ImageUploadService";
import DriverService from "../../services/DriverService";

const AddDriver = ({onAddDriver}) => {
    const [image, setImage] = useState(null);
    const [newDriver, setNewDriver] = useState({
        id: 0,
        name: "",
        age: 0,
        nationality: "",
        driverImage: "",
    })
    const [isAddDriverFormVisible, setIsAddDriverFormVisible] = useState(false);

    //toggles the add form
    const toggleAddDriverForm = () => {
        setIsAddDriverFormVisible(!isAddDriverFormVisible);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setNewDriver({...newDriver, driverImage: file.name});
    }

    const handleAddNewDriver = async()=>{
        //upload image
        try{
            if(image!=null){
                await ImageUploadService.uploadImage(image);
            }
        }
        catch(error){
            console.error("error uploading image", error);
        }
        //upload driver
        try{
            const response = await DriverService.addDriver(newDriver);
            onAddDriver(newDriver);
            setNewDriver({id: 0, 
                name: "", 
                age: 0, 
                nationality: "", 
                driverImage: ""
            });
            //removes form after user submits the driver
            setIsAddDriverFormVisible(false);
            console.log(newDriver.name)
        }
        catch(error){
            console.error("error adding driver", error)
        }
    }
    return(
        <div
        //Styling for Input forms
        className="w-2/3 md:w-1/2 lg:w-1/4 bg-black p-2 flex flex-col space-y-2 rounded-lg ">
            <button
                onClick={()=>toggleAddDriverForm()}
                className="inline-flex justify-center items-center max-h-full max-w-full p-3 rounded-lg sm:w-auto sm:max-w-xs px-4 sm:px-8 font-light tracking-wide text-white transition duration-200 bg-black  hover:bg-red-700">
                Add A Driver
            </button>
            {isAddDriverFormVisible && (
            <div className=" p-2 flex flex-col space-y-2 ">
            <p
            className="text-sm text-white">Enter ID</p>
                <input
                    type="text"
                    placeholder="id"
                    value={newDriver.id}
                    onChange={(e)=>setNewDriver({...newDriver, id: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Enter name</p>                    
                <input
                    type="text"
                    placeholder="name"
                    value={newDriver.name}
                    onChange={(e)=>setNewDriver({...newDriver, name: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                className="text-sm text-white">Enter age</p>
                <input
                    type="text"
                    placeholder="age"
                    value={newDriver.age}
                    onChange={(e)=>setNewDriver({...newDriver, age: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p
                    className="text-sm text-white">Enter nationality</p>
                <input
                    type="text"
                    placeholder="nationality"
                    value={newDriver.nationality}
                    onChange={(e)=>setNewDriver({...newDriver, nationality: e.target.value})}
                    className="w-full p-2 border-gray-300 rounded"
                >
                </input>
                <p 
                    className="text-sm text-white">Add image</p>
                <input className="bg-gray-300 rounded"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                > 
                </input>
                
                <button
                    onClick={handleAddNewDriver}
                    className="w-full bg-white text-black transition duration-200 hover:bg-blue-700 font-bold p-2 rounded hover:text-white"
                >Add Driver</button>
            </div>
            )}
        </div>
    )
}
export default AddDriver;