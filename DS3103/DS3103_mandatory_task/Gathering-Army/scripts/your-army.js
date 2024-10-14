import YourArmyModule from "./modules/YourArmyModule.js";
import GettingResourcesModule from "./modules/GettingResourcesModule.js";

const armyOutput = document.getElementById("army-output");

// output variables
let materialOutput = document.getElementById("materials-output");

const showMaterials = () => {
    let gold = GettingResourcesModule.retrieveGold();
    let metal = GettingResourcesModule.retrieveMetal();
    let wood = GettingResourcesModule.retrieveWood();

    let output = "";

    output += `
        <section class="materials-bar">
        <div>
        <div><img src="./images/gold-coin.png"/><p>${gold}</p></div>
            <div><img src="./images/metal.png"/><p>${metal}</p></div>
            <div><img src="./images/wood.png"/><p>${wood}</p></div>
        </div>
        </section>
    `
    materialOutput.innerHTML = output;
}

const showArmyArray = (armyArray) => {
    let output ="";
    if(armyArray.length > 0){
        armyArray.forEach((armyItem) => {
        output += `
            <section class="shop-item">
                <h3 class="shop-item-title">Name: ${armyItem.name}</h3>
                <p>Category: ${armyItem.categoryName}<p>
                <img class="responsive-image" src="images/${armyItem.image}">
            </section>
        `
    })
    }else{
        output += `<h1 id="text-span"> Your army is empty, please navigate to the shop and buy something</h1>`
    }
    armyOutput.innerHTML = output;
}

const showArmyItems = () => {
    const items = YourArmyModule.sortArmy();
    showArmyArray(items)
}

( () => {
    showArmyItems();
    showMaterials();

})();