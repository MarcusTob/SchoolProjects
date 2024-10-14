import { useState, useEffect } from "react";
import DriverService from "../services/DriverService";
import GetDriverId from "../components/driver/GetDriverId";
import AddDriver from "../components/driver/AddDriver";
import DriverList from "../components/driver/DriverList";
import GetDriverName from "../components/driver/GetDriverName";


const DriverPage = () => {
    const [drivers, setDrivers] = useState([]);

    //gets all drivers from the api
    const getAllDrivers = async () => {
        const response = await DriverService.getAllDrivers();
        setDrivers(response);
    }
    //adds a driver to the drivers array
    const addDriver = (newDriver) => {
        setDrivers([...drivers, newDriver]);
    }
    //finds driver with matching id in the drivers array
    const getDriverById = async (id) => {
        const targetDriver = drivers.find((driver) =>
            driver.id === parseInt(id)
        );
        if (targetDriver != null) {
            setDrivers([targetDriver]);
        }
        else {
            setDrivers([]);
        }
    }
    //finds driver with maching name in the drivers array
    const getDriverByName = async (name)=>{
        const targetDriver = drivers.find((driver) =>
        driver.name === name
        );
        if(targetDriver != null) {
            setDrivers([targetDriver]);
        }
        else {
            setDrivers([]);
        }
    }
    //updates driverlist when changes are done
    useEffect(() => {
        getAllDrivers();
    }, []);

    return (
        <div className="container mx-auto ">
            <h1 className="mb-4 text-3xl font-extrabold text-red-700 md:text-5xl lg:text-6xl">F1 DRIVERS</h1>
            <div className="container">
                <div className="bg-white py-4 p-7">
                    <section className="flex justify-between">
                        <AddDriver onAddDriver={addDriver} />
                        <GetDriverId onGetDriver={getDriverById} />
                        <GetDriverName onGetDriver={getDriverByName} />
                    </section>
                </div>

                <div>
                    <DriverList drivers={drivers} setDrivers={setDrivers} />
                </div>
            </div>
        </div>
    )
}
export default DriverPage;