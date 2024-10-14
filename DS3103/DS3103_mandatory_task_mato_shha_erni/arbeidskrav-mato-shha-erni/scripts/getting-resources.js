import GettingResourcesModule from "./modules/GettingResourcesModule.js";

// image variables
const mine = document.getElementById("mine-img")
const forest = document.getElementById("forest-img");

// output variables
let materialOutput = document.getElementById("materials-output");

// func to show materials in html
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

// initializes onclick funtion to gather materials
const gatherFromMine = () => {
    GettingResourcesModule.mineClicked();
    showMaterials()
}

const gatherFromForest = () => {
    GettingResourcesModule.forestClicked();
    showMaterials();
}

// initializes immediately when the page is loaded to display current materials
(
    () => {
        showMaterials();
    }
)();

// onclick variables
mine.addEventListener("click", gatherFromMine);
forest.addEventListener("click", gatherFromForest);