import {useState} from "react";
import DriverItem from "./DriverItem";
import UpdateDriver from "./UpdateDriver";
import DriverService from "../../services/DriverService";

const DriverList=({drivers, setDrivers}) =>{
    const [updatedDriverId, setUpdatedDriverId] = useState({});
    const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

    //handles delete driver
    const handleDeleteDriver =async(id) =>{
        try{
            await DriverService.deleteDriver(id);
            const driversAfterDelete = drivers.filter((driver=>driver.id!==id));
            setDrivers(driversAfterDelete)
        }
        catch(error){
            console.error("error deleting driver", error)
        }
    }
    //toggles update form
    const toggleUpdateForm = (driver)=>{
        setIsUpdateFormVisible(!isUpdateFormVisible);
        setUpdatedDriverId(driver.id);
    }
    //handles update
    const handleUpdateDriver=async(updatedDriver)=>{
        try{
            const driversAfterUpdate = drivers.map((driver)=>
                driver.id===updatedDriver.id? updatedDriver:driver
            );
            setDrivers(driversAfterUpdate);
            setIsUpdateFormVisible(false);
        }
        catch(error) {
            console.error("error updating driver")
        }
    }
    return(
        <div className="bg-red-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/*loops through each driver and displays accordingly */}
            {drivers.map((driver=>
            <div 
            className= "flex flex-col items-center bg-red-800 py-5 rounded-lg"
            key={driver.id}>
              <DriverItem driver={driver}/>
              <div className="flex space-x-2">
                <button
                  onClick={
                    // promts user with an alert to confirm or abort deletion of driver
                    ()=>{if(window.confirm('Are you sure you want to delete ' + driver.name + '?'))handleDeleteDriver(driver.id)}
                  }
                  className="px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-red-500"
                >
                  Delete Driver
                </button>
                <button
                  onClick={()=>toggleUpdateForm(driver)}
                  className="inline-flex items-center justify-center h-10 px-4 font-light tracking-wide text-white transition duration-200 bg-gray-900 rounded-lg hover:bg-blue-800"
                >
                  Update Driver
                </button>
              </div>
                {isUpdateFormVisible && updatedDriverId===driver.id &&(
                  <UpdateDriver 
                      driver={driver}
                      onUpdateDriver={handleUpdateDriver}
                  />
                )}
            </div>
            ))}
          </div>  
            {!drivers.length && (
                <p className="text-black-500 font-medium text-lg mt-2">No drivers found</p>
            )}
        </div>
    )
}
export default DriverList;