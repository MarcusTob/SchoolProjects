const GatheringWarMachinesModule = (
    () => {

        // list of items
        const warMachineList = [
            {
                name: "Catapult",
                categoryName: "War Machine",
                image: "catapult.png",
                priceGold: 600,
                priceMetal: 2000,
                priceWood: 3500
            },
            {
                name: "Cannon",
                categoryName: "War Machine",
                image: "cannon.png",
                priceGold: 400,
                priceMetal: 3500,
                priceWood: 2000
            }
        ];

        // returns full list
        const getAllMachines = () => warMachineList;

        return {
            getAllMachines,
        }
    }
)();

export default GatheringWarMachinesModule;