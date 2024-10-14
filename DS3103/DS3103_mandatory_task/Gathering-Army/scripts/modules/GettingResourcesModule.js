const GettingResourcesModule = (
    () => {

        // sets initial values to be 0
        let gold = 0;
        let metal = 0;
        let wood = 0;

        // checks if there is any material in localstorage, if there is, returns the value
        // if there is no stored value in localstorage, the value gets set to initial value -> 0
        const retrieveGold = () => {
            if (localStorage.getItem("gold") != null) {
                let currentGold = JSON.parse(localStorage.getItem("gold"));
                return currentGold;
            }
            return gold;
        }
        const retrieveMetal = () => {
            if (localStorage.getItem("metal") != null) {
                let currentMetal = JSON.parse(localStorage.getItem("metal"));
                return currentMetal;
            }
            return metal;
        }
        const retrieveWood = () => {
            if (localStorage.getItem("wood") != null) {
                let currentWood = JSON.parse(localStorage.getItem("wood"));
                return currentWood;
            }
            return wood;
        }

        // functions to save each material to local storage
        const saveGoldToStorage = (gold) => {
            const gatheredGold = gold;
            localStorage.setItem('gold', JSON.stringify(gatheredGold));
        }
        const saveMetalToStorage = (metal) => {
            const gatheredMetal = metal;
            localStorage.setItem('metal', JSON.stringify(gatheredMetal));
        }
        const saveWoodToStorage = (wood) => {
            const gatheredWood = wood;
            localStorage.setItem('wood', JSON.stringify(gatheredWood));
        }

        // function to give materials and save them to local storage
        // materials given is based on a random number between 0-100, 
        // math.floor secures that there are no decimals
        const mineClicked = () => {
            var numberOfCurrency = Math.floor(Math.random() * 100);
            var rolled = Math.floor(Math.random() * 100);
            metal = retrieveMetal();
            gold = retrieveGold();

            if (rolled < 75) {
                metal += numberOfCurrency;
            }
            else {
                gold += numberOfCurrency;
            }

            saveGoldToStorage(gold);
            saveMetalToStorage(metal);
        }

        const forestClicked = () => {
            var numberOfCurrency = Math.floor(Math.random() * 100);
            wood = retrieveWood();

            wood += numberOfCurrency;

            saveWoodToStorage(wood);
        }

        return {
            mineClicked,
            forestClicked,
            retrieveGold,
            retrieveMetal,
            retrieveWood,
            saveGoldToStorage,
            saveMetalToStorage,
            saveWoodToStorage
        }
        
    })();

export default GettingResourcesModule;