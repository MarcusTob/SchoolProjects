const imageUrl = "http://localhost:5056/images";
const TeamItem=({team})=>{
    return(
        <div className="bg-white rounded-lg p-3 max-w-sm overflow-hidden shadow-lg mx-auto my-8 text-gray-600 text-base">
            <p className="text-2xl leading-tight text-l text-red-700 font-bold"> Id: {team.id}</p>
            <p className="text-4xl font-semibold"> Manufacturer: {team.manufacturer}</p>
            <p className="text-2xl"> Driver 1: {team.driver1}</p>
            <p className="text-2xl"> Driver 2: {team.driver2}</p>
            <img className="w-80 object-cover rounded mb-4"
                src={`${imageUrl}/${team.carImage}`} alt={`${team.carImage}`}/>
        </div>
    )
}
export default TeamItem;