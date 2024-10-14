import GatheringArmyModule from "./modules/GatheringArmyModule.js";
import GatheringWarriorsModule from "./modules/GatheringWarriorsModule.js";
import GatheringAnimalsModule from "./modules/GatheringAnimalsModule.js";
import GatheringWarMachinesModule from "./modules/GatheringWarMachinesModule.js";
import GettingResourcesModule from "./modules/GettingResourcesModule.js";

// btn
const warriorButton = document.getElementById("warrior-btn");
const animalButton = document.getElementById("animal-btn");
const machineButton = document.getElementById("machine-btn");

// output
const materialOutput = document.getElementById("materials-output")
const warriorOutput = document.getElementById("warrior-output");
const animalOutput = document.getElementById("animal-output");
const machineOutput = document.getElementById("machine-output");

// clear display when button is pressed to show a different array of items
const clearDisplay = () => {
  let output = "";

  warriorOutput.innerHTML = output;
  animalOutput.innerHTML = output;
  machineOutput.innerHTML = output;
};

// show material bar
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

// makes it possible to make onclick functions on buttons
// the displaying function does not do that for some reason, only makes onclick on last object
// loops through all items displayed, and adds possibility to assign an onclick function which we define
function assignButtonActions(items, assignedFunction) {
  items.forEach((item) => {
    let button = document.getElementById(`buy-${item.name}`);
    button.onclick = function () {
      assignedFunction(item);
    }
  });
}

// formatting functions for displaying items
const showWarriors = (warriors) => {
  let output = "";
  warriors.forEach((warrior) => {
    output = `
            <section class="grid shop-item">
                <h3 class="text-lg shop-item-title">${warrior.name} </h3>
                <p>Category: ${warrior.categoryName} </p>
                <p class="flex price">${warrior.priceGold}<img src="images/gold-coin.png" class="price-img"></p>

                <img class="responsive-image" src="images/${warrior.image}"></img>
                <button class="buy-button" id="buy-${warrior.name}">Buy ${warrior.name} <img src="images/gold-coin.png" class="price-img"></button>
            </section>
        `;
    warriorOutput.innerHTML += output
  });

  //assigns function buyItem to each button for each warrior
  assignButtonActions(warriors, buyItem);
};

const showAnimals = (animals) => {
  let output = "";
  animals.forEach((animal) => {
    output = `
        <section class="grid shop-item">
            <h3 class="text-lg shop-item-title">${animal.name} </h3>
            <p>Category: ${animal.categoryName} </p>
            <p class="flex price">Price: ${animal.priceGold}<img src="images/gold-coin.png" class="price-img"></p>
            <img class="responsive-image" src="images/${animal.image}"></img>
            <button class=buy-button id=buy-${animal.name}>Buy ${animal.name}</button>
    </section>
    `;
    animalOutput.innerHTML += output;
  });

  // assigns function buyItem to each button for each animal
  assignButtonActions(animals, buyItem);
};


// need to add additional price items (metal and wood)
const showWarMachines = (warMachines) => {
  let output = "";
  warMachines.forEach((warMachine) => {
    output = `
        <section class="grid shop-item">
            <h3 class="text-lg shop-item-title">${warMachine.name} </h3>
            <p>Category: ${warMachine.categoryName} </p>
            <p class="flex price">Cost: ${warMachine.priceGold}<img src="images/gold-coin.png" class="price-img">
                                        ${warMachine.priceMetal}<img src="images/metal.png" class="price-img"> 
                                        ${warMachine.priceWood}<img src="images/wood.png" class="price-img">
            </p>
            <img class="responsive-image" src="images/${warMachine.image}"></img>
            <button class=buy-button id=buy-${warMachine.name}>Buy ${warMachine.name}</button>
    </section>
    `;
    machineOutput.innerHTML += output;
  });
  // assigns function buyItem to each button for each warMachine, change funtion to own? because of additional prices.
  assignButtonActions(warMachines, buyItem);
};

// functions to display items from array, to the html
const showWarriorItems = () => {
  clearDisplay();
  const items = GatheringWarriorsModule.getAllWarriors();
  showWarriors(items);
};

const showAnimalItems = () => {
  clearDisplay();
  const items = GatheringAnimalsModule.getAllAnimals();
  showAnimals(items);
};

const showWarMachineItems = () => {
  clearDisplay();
  const items = GatheringWarMachinesModule.getAllMachines();
  showWarMachines(items);
};

const buyItem = (item) => {
  GatheringArmyModule.buyItem(item);
  showMaterials();
};

// functions to be ran immediately when page loads, display warrior list and materials
(() => {
  showWarriorItems();
  showMaterials();
})();

// event listners
warriorButton.addEventListener("click", showWarriorItems);
animalButton.addEventListener("click", showAnimalItems);
machineButton.addEventListener("click", showWarMachineItems);
