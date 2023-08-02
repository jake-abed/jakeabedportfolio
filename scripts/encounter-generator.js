"use strict";

let masterEnemyArray, masterEncounterArray, masterCombatEncounterArray //Declare all arrays to store data.

//The following variables fetch the necesssary JSON files and store  the results in the previous declared variables.
const MASTER_ENEMY_ARRAY_PROMISE = fetch("./data/encounter-generator/MASTER_ENEMY_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterEnemyArray = json});

const MASTER_ENCOUNTER_ARRAY_PROMISE = fetch("./data/encounter-generator/MASTER_ENCOUNTER_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterEncounterArray = json});

const MASTER_COMBAT_ENCOUNTER_ARRAY_PROMISE = fetch("./data/encounter-generator/MASTER_COMBAT_ENCOUNTER_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterCombatEncounterArray = json});

//Establish variables for User Input from DOM & Elements where results will be displayed.
const GENERATE_ENCOUNTER_BUTTON = document.getElementById("annoying-button"),
      ENCOUNTER_SETTING = document.getElementById("encounter-setting"),
      IS_COMBAT = document.getElementById("is-combat"),
      DESIRED_CR = document.getElementById("cr"),
      NUM_OF_PLAYERS = document.getElementById("number-of-players"),
      ENCOUNTER_TITLE_DISPLAY = document.getElementById("encounter-title"),
      ENCOUNTER_DESC_DISPLAY = document.getElementById("encounter-description"),
      ENCOUNTER_ENEMIES_DISPLAY = document.getElementById("encounter-enemies"),
      ENCOUNTER_REWARD_DISPLAY = document.getElementById("encounter-rewards"),
      ENCOUNTER_DM_NOTES_DISPLAY = document.getElementById("encounter-dm-notes");
/*
Preferences Object - Contains the preferences from the user input.
*/
const ENCOUNTER_PREFERENCES = { //Set to default values
    setting: "random",
    combat: false,
    desiredCR: 1,
    numOfPlayers: 3,
    calculatedCR: function () { //Method to determine desired difficulty
        return this.desiredCR * this.numOfPlayers * 2;
    },
    update: function () { //Method to update Preferences with User Inputs
        this.setting = ENCOUNTER_SETTING.value;
        this.combat = (IS_COMBAT.value === "true");
        this.desiredCR = Number(DESIRED_CR.value);
        this.numOfPlayers = Number(NUM_OF_PLAYERS.value);
        this.maxEnemyCR = this.desiredCR * 8;
        return this;
    },
}

/*Declare Current Encounter object to store information about the selected encounter.
Init values will always be overwritten by the fillCurrentEncounterObj function.
If a null value sneaks through, that function has broken or one of CURRENT_ENCOUNTER's
method's has broken as well.
*/
const CURRENT_ENCOUNTER = {
    title: null,
    description: null,
    requiredEnemy: null,
    enemyType: null,
    singleEnemy: null,
    rewardTable: null,
    dmNotes: null,
    reward: function () {
        return selectRandomArrayEntry(this.rewardTable); //Method grabs a random reward from the rewardTable property.
    },
    enemies: null,
    populateEnemyList: function () { //Method to generate a list of all enemies that could appear in the encounter given current restrictions stored in Preferences and Current Encounter.
        if (this.enemyType === undefined) {
            this.potentialEnemyList = createPossibleEnemyList("all", this.requiredEnemy); //If enemy type has not being supplied
        } else {
            this.potentialEnemyList = createPossibleEnemyList(this.enemyType, this.requiredEnemy);
        }
        return;
    },
    chooseEnemies: function () {
        const minCR = ENCOUNTER_PREFERENCES.calculatedCR() - 8; //Establish a minimum CR for single Enemy Encounters.
        let remainingCR = ENCOUNTER_PREFERENCES.calculatedCR();
        console.log(minCR);
        if (!this.potentialEnemyList) return console.error("Could not populate enemies."); //If there are no potential enemies, return and log an error.
        if (this.potentialEnemyList.length === 1 && this.singleEnemy === true) return this.enemies = this.potentialEnemyList; //If there is only a single enemy in the potential enemy list and there's only a single enemy required, you're set.
        if (this.singleEnemy === true) { //In case of single enemy, but multiple entries...
            let trimmedEnemyList = []; //Declare an array variable to store Enemies that meet the criteria.
            for (let i = 0; i < this.potentialEnemyList.length; i++) { //Run the loop for each enemy in the potentialEnemyList
                if (this.potentialEnemyList[i].cr >= minCR) //If the enemy's CR is greater than or equal to minCR...
                trimmedEnemyList.push(this.potentialEnemyList[i]); //Push it to the end of the trimmedEnemyList!
            }
            console.log(trimmedEnemyList);
            trimmedEnemyList.length != 0 ? this.enemies = [selectRandomArrayEntry(trimmedEnemyList)] : this.enemies = [selectRandomArrayEntry(this.potentialEnemyList)]; //If trimmedEnemyList is not equal to zero, choose one. If no enemies met the criteria, just choose one from the initial list.
            //Side note: this could be refactored to be a function that could recur. It could rerun the function with slightly less stringent criteria? Food for thought.
        } else {
            let finalEnemyList = []; //Declare an array variable to store all enemies in.
            let acceptableDeviance = remainingCR / 8; //Establish an acceptable range of deviance from the
            let breakpoint = 0; //Establish a breakpoint. If the loop ever pass this many iterations, it ends the loop. Basically a safety valve.
            while (remainingCR > acceptableDeviance && breakpoint < 50) {
                let enemyRoll = selectRandomArrayEntry(this.potentialEnemyList);
                breakpoint++; //Increment breakpoint up -- remember this won't check this until next iteration.
                if (enemyRoll.cr <= remainingCR && enemyRoll.cr <= minCR) {
                    finalEnemyList.push(enemyRoll); //Push the enemy to the end of the output list.
                    remainingCR -= enemyRoll.cr; //And decrement remainingCR
                }
            }
            if (breakpoint >= 50) alert("Hey! Looks like this combat encounter didn't populate super well. Consider re-rolling it, okay?") //If you had to break out, let the user know. Worth refactoring later.
            this.enemies = finalEnemyList; //Update the enemies property!
        }
        return this.enemies; //Is this necessary? Not unhelpful for testing I suppose.
    }
}

let potentialEncounters = []; //Declare an array to store potentialEncounters.

function selectRandomArrayEntry(anArray) { //Helper function to grab a random entry from an array.
    return anArray[Math.floor(Math.random()*anArray.length)]
}

function createPossibleEnemyList(enemyType = "all", enemyName = undefined) { //Helper function to create a array of Enemies.
    const maxEnemyCR = ENCOUNTER_PREFERENCES.calculatedCR(); //Pull globally scoped object properties and store them in locally scoped constants
    const location = ENCOUNTER_PREFERENCES.setting;
    let i = 0;
    let enemyList = [];
    while (i < masterEnemyArray.length) { //Go through each enemy in the Master Enemy Array.
        let currentMasterEnemyArrayEntry = masterEnemyArray[i]; //Verbose?
        if (currentMasterEnemyArrayEntry.cr <= maxEnemyCR && currentMasterEnemyArrayEntry.cr >= maxEnemyCR/32 && currentMasterEnemyArrayEntry.potentialLocations.includes(location) == true && (currentMasterEnemyArrayEntry.enemyType == enemyType || enemyType == "all") && (enemyName == undefined || currentMasterEnemyArrayEntry.name == enemyName)) { //These entry criteria are hideous. How can I do this better? With a test function? Passes all tests, true?
            enemyList.push(masterEnemyArray[i]); //If it passes, push it to the end of enemyList...
            i++; //And increment the index up.
        } else {
            i++; //Or just increment the index up if it fails.
        }
    }
    return enemyList; //Return the curated enemy list.
}

function populateNonCombatEncounters() { //Helper function to narrow down to a pool of encounters that match user input.
    const SETTING = ENCOUNTER_PREFERENCES.setting;
    potentialEncounters = [];
    let i = 0;
    while (i<masterEncounterArray.length) {
        if (masterEncounterArray[i].location.includes(SETTING)) potentialEncounters.push(masterEncounterArray[i]);
        i++;
    }
    return;
}

function populateCombatEncounters() { //Helper function to narrow down to a pool of combat encounters that match user input.
    const SETTING = ENCOUNTER_PREFERENCES.setting;
    const CR = ENCOUNTER_PREFERENCES.calculatedCR();
    potentialEncounters = [];
    let i = 0;
    while (i<masterCombatEncounterArray.length) {
        if (masterCombatEncounterArray[i].locations.includes(SETTING) && (masterCombatEncounterArray[i].minCR <= CR+2) && (CR <= masterCombatEncounterArray[i].maxCR)) {
            potentialEncounters.push(masterCombatEncounterArray[i]);
        }
        i++;
    }
    return;
}

function fillCurrentEncounterObj(encounterObject) { //Helper function to update the CURRENT_ENCOUNTER object with the details from 
    CURRENT_ENCOUNTER.title = encounterObject.title ?? "No Title";
    CURRENT_ENCOUNTER.description = encounterObject.description ?? "No Description";
    CURRENT_ENCOUNTER.dmNotes = encounterObject.dmNotes ?? "No DM Notes"
    CURRENT_ENCOUNTER.rewardTable = encounterObject.rewardTable ?? "NA";
    CURRENT_ENCOUNTER.enemies = encounterObject.enemies ?? undefined;
    CURRENT_ENCOUNTER.enemyType = encounterObject.enemyType ?? undefined;
    CURRENT_ENCOUNTER.requiredEnemy = encounterObject.requiredEnemy ?? undefined;
    CURRENT_ENCOUNTER.singleEnemy = encounterObject.singleEnemy ?? false;
    CURRENT_ENCOUNTER.populateEnemyList();
    CURRENT_ENCOUNTER.chooseEnemies();
    return CURRENT_ENCOUNTER;
}

function updateEncounterContainer() {
    ENCOUNTER_TITLE_DISPLAY.innerHTML = CURRENT_ENCOUNTER.title;
    ENCOUNTER_DESC_DISPLAY.innerHTML = CURRENT_ENCOUNTER.description;
    ENCOUNTER_REWARD_DISPLAY.innerHTML = CURRENT_ENCOUNTER.reward();
    ENCOUNTER_DM_NOTES_DISPLAY.innerHTML = CURRENT_ENCOUNTER.dmNotes;
    ENCOUNTER_ENEMIES_DISPLAY.innerHTML = "";
    if (!ENCOUNTER_PREFERENCES.combat) return;
    CURRENT_ENCOUNTER.enemies.forEach(enemy => {
        const PARAGRAPH = document.createElement("p");
        PARAGRAPH.innerHTML = "<p>" + enemy.name + " - " + "XP: " + enemy.xpVal + " - " + "CR: "+ enemy.cr/8 + "</p>";
        ENCOUNTER_ENEMIES_DISPLAY.insertAdjacentElement("beforeend", PARAGRAPH);
    });
    return;
}

function createRandomEncounter() {
    ENCOUNTER_PREFERENCES.update();
    if (ENCOUNTER_PREFERENCES.combat == false) populateNonCombatEncounters();
    if (ENCOUNTER_PREFERENCES.combat == true) populateCombatEncounters();
    fillCurrentEncounterObj(selectRandomArrayEntry(potentialEncounters));
    updateEncounterContainer();
    return;
}


GENERATE_ENCOUNTER_BUTTON.addEventListener("click", createRandomEncounter, false);