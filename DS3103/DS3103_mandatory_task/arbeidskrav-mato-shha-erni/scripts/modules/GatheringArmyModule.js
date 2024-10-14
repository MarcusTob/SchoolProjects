import GettingResourcesModule from "./GettingResourcesModule.js";
import YourArmyModule from "./YourArmyModule.js";

const GatheringArmyModule = (
    () => {

        // function to buy item, takes gold from localstorage, and subtracts the cost of item clicked
        // then saves the new value to the local storage
        const buyItem = (item) => {
            let storedGold = GettingResourcesModule.retrieveGold();
            let storedMetal = GettingResourcesModule.retrieveMetal();
            let storedWood = GettingResourcesModule.retrieveWood();

            if (storedGold > item.priceGold && storedMetal > item.priceMetal && storedWood > item.priceWood) {
                storedGold -= item.priceGold;
                storedMetal -= item.priceMetal;
                storedWood -= item.priceWood;
                GettingResourcesModule.saveGoldToStorage(storedGold);
                GettingResourcesModule.saveMetalToStorage(storedMetal);
                GettingResourcesModule.saveWoodToStorage(storedWood);
                YourArmyModule.saveItemToArmy(item);
            } else {
                alert("You do not have enough currency for this item");
            }
        }

        return {
            buyItem,
            
        }

    })();
    
export default GatheringArmyModule;