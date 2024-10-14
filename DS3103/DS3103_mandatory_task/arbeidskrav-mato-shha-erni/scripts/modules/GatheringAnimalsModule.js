const GatheringAnimalsModule = (
    () => {
        // list of items
        const animalList = [
            {
                name: "Elephant",
                categoryName: "Animal",
                image: "elephant.png",
                priceGold: 800,
                priceMetal: 0,
                priceWood: 0
            },
            {
                name: "Horse",
                categoryName: "Animal",
                image: "horse.png",
                priceGold: 650,
                priceMetal: 0,
                priceWood: 0
            }
        ];

        // returns full list
        const getAllAnimals = () => animalList;

        return {
            getAllAnimals,
        }
    }
    
) ();

export default GatheringAnimalsModule;