import axios from "axios";

const DriverService = (()=>{
    const driverUrl="http://localhost:5056/FormulaOne/drivers";
    
    const getAllDrivers = async() =>{
        try{
            const response = await axios.get(driverUrl);
            return response.data;
        }
        catch(error){
            console.error("error getting driver", error);
        }
    }

    const addDriver = async (newDriver) => {
        try{
            const response = await axios.post(driverUrl, newDriver);
        }
        catch(error){
            console.log("HALLO NOE ER GALE")
            console.log(error)
            console.error("error adding driver", error.response.data)
        }
    }

    const updateDriver = async (updatedDriver) =>{
        try{
            const response = await axios.put(`${driverUrl}/${updatedDriver.id}`, updatedDriver);
        }
        catch(error){
            console.error("error updating driver", error);
        }
    }
    
    const deleteDriver = async(id) =>{
        try{
            await axios.delete(`${driverUrl}/${id}`);
        }
        catch(error){
            console.error("error deleting driver", error);
        }
    }

    return {
        getAllDrivers,
        addDriver,
        updateDriver,
        deleteDriver
    }
})();
export default DriverService;