const YourArmyModule = (
    () => {
        // checks if armyarray exists in local storage, if not, returns an empty array
        const checkIfArmyArrayExist =()=>{
            return localStorage.getItem("yourArmyArray")!=null;
        }
        const getArmyArray=() => {
            if(checkIfArmyArrayExist()) {
                return JSON.parse(localStorage.getItem("yourArmyArray"))
            }
            else{
                return [];
            }
        }

        // saves item bought to localstorage
        const saveItemToArmy =(item)=>{
            let armyArray = getArmyArray();
            armyArray.push(item);
            localStorage.setItem("yourArmyArray", JSON.stringify(armyArray));
        }

        // sorts army based on category, but reversed, so warriors are first displayed
        const sortArmy = () =>{
            const armyArray = getArmyArray();
            const sortedArmy = [...armyArray];
            return sortedArmy.sort((item1, item2) => item1.categoryName < item2.categoryName ? 1:-1);
        }
        
        return {
            getArmyArray,
            checkIfArmyArrayExist,
            saveItemToArmy,
            sortArmy
        }
    }) ();
    
export default YourArmyModule;