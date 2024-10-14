const GatheringWarriorsModule = (
    () => {

        // list of items
        const warriorList = [
            {
                name: "Snake",
                categoryName: "Warrior",
                image: "warrior-1.jpg",
                priceGold: 200,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Giant",
                categoryName: "Warrior",
                image: "warrior-2.jpg",
                priceGold: 500,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Big Axe",
                categoryName: "Warrior",
                image: "warrior-3.jpg",
                priceGold: 150,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Thief",
                categoryName: "Warrior",
                image: "warrior-4.jpg",
                priceGold: 50,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Tanks",
                categoryName: "Warrior",
                image: "warrior-5.jpg",
                priceGold: 250,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Berserker",
                categoryName: "Warrior",
                image: "warrior-6.jpg",
                priceGold: 275,
                priceMetal: 0,
                priceWood: 0
            }
        ];

        // returns full list
        const getAllWarriors = () => warriorList;

        return {
            getAllWarriors,
        }

    }
)();

export default GatheringWarriorsModule;