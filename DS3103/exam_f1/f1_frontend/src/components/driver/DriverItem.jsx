const imageUrl = "http://localhost:5056/images";
const DriverItem=({driver})=>{
    return(
        //Driver cards styling
        <div className="bg-white rounded-lg p-3 max-w-sm overflow-hidden shadow-lg mx-auto my-8 text-gray-600 text-base">
            <p className="text-2xl leading-tight text-l text-red-700 font-bold"> Id: {driver.id}</p>
            <p className="text-4xl font-semibold"> {driver.name}</p>
            <p className="text-2xl"> Age: {driver.age}</p>
            <p className="text-2xl"> Nationality: {driver.nationality}</p>
            <img className="w-80 object-cover rounded mb-4"
             src={`${imageUrl}/${driver.driverImage}`} alt={`picture of ${driver.name}`}/>
        </div>
    )
}
export default DriverItem;