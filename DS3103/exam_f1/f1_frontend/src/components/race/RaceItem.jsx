const RaceItem=({race})=>{
    return(
        <div className="bg-white rounded-lg p-3 max-w-sm overflow-hidden shadow-lg mx-auto my-8 text-gray-600 text-base">
            <p className="text-2xl leading-tight text-l text-red-700 font-bold"> Race ID: {race.id}</p>
            <p className="text-2xl font-semibold"> Winner Name: {race.winnerName}</p>
            <p className="text-2xl"> Winner Time: {race.winnerTime}</p>
            <p className="text-2xl"> Country: {race.country}</p>
            <p className="text-2xl"> Number of laps: {race.numberOfLaps}</p>
        </div>
    )
}
export default RaceItem;