"use strict";

/*
import MASTER_ENEMY_ARRAY from "../data/encounter-generator/MASTER_ENEMY_ARRAY.json" assert {type: "json"};
import MASTER_ENCOUNTER_ARRAY from "../data/encounter-generator/MASTER_ENCOUNTER_ARRAY.json" assert {type: "json"};
import MASTER_COMBAT_ENCOUNTER_ARRAY from "../data/encounter-generator/MASTER_COMBAT_ENCOUNTER_ARRAY.json" assert {type: "json"};
*/

let masterEnemyArray, masterEncounterArray, masterCombatEncounterArray

const MASTER_ENEMY_ARRAY_PROMISE = fetch("./data/encounter-generator/MASTER_ENEMY_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterEnemyArray = json});

const MASTER_ENCOUNTER_ARRAY = fetch("./data/encounter-generator/MASTER_ENCOUNTER_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterEncounterArray = json});

const MASTER_COMBAT_ENCOUNTER_ARRAY = fetch("./data/encounter-generator/MASTER_COMBAT_ENCOUNTER_ARRAY.json")
    .then((response) => response.json())
    .then((json) => {return masterCombatEncounterArray = json});



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
    calculatedCR: function () {
        return this.desiredCR * this.numOfPlayers * 2;
    },
    update: function () {
        this.setting = ENCOUNTER_SETTING.value;
        this.combat = (IS_COMBAT.value === "true");
        this.desiredCR = Number(DESIRED_CR.value);
        this.numOfPlayers = Number(NUM_OF_PLAYERS.value);
        this.maxEnemyCR = this.desiredCR * 8;
        return this;
    },
}

const CURRENT_ENCOUNTER = {
    title: null,
    description: null,
    requiredEnemy: null,
    enemyType: null,
    singleEnemy: null,
    rewardTable: null,
    dmNotes: null,
    reward: function () {
        return selectRandomArrayEntry(this.rewardTable);
    },
    enemies: null,
    populateEnemyList: function () {
        if (this.enemyType === undefined) {
            this.potentialEnemyList = createPossibleEnemyList("all", this.requiredEnemy);
        } else {
            this.potentialEnemyList = createPossibleEnemyList(this.enemyType, this.requiredEnemy);
        }
        return;
    },
    chooseEnemies: function () {
        const minCR = ENCOUNTER_PREFERENCES.calculatedCR() - 16;
        let remainingCR = ENCOUNTER_PREFERENCES.calculatedCR();
        if (!this.potentialEnemyList) return console.log("Could not populate enemies.");
        if (this.potentialEnemyList.length === 1) return this.enemies = this.potentialEnemyList;
        if (this.singleEnemy === true) {
            let trimmedEnemyList = [];
            for (let i = 0; i < this.potentialEnemyList.length; i++) {
                if (this.potentialEnemyList[i].cr >= minCR)
                trimmedEnemyList.push(this.potentialEnemyList[i]);
            }
            trimmedEnemyList.length != 0 ? this.enemies = [selectRandomArrayEntry(trimmedEnemyList)] : this.enemies = [selectRandomArrayEntry(this.potentialEnemyList)];
        } else {
            let finalEnemyList = [];
            while (remainingCR > 0) {
                let enemyRoll = selectRandomArrayEntry(this.potentialEnemyList);
                if (enemyRoll.cr <= remainingCR) {
                    finalEnemyList.push(enemyRoll);
                    remainingCR -= enemyRoll.cr;
                }
            }
            this.enemies = finalEnemyList;
        }
        return this.enemies;
    }
}

let potentialEncounters = [];

function selectRandomArrayEntry(anArray) {
    return anArray[Math.floor(Math.random()*anArray.length)]
}

function createPossibleEnemyList(enemyType = "all", enemyName = undefined) {
    const maxEnemyCR = ENCOUNTER_PREFERENCES.calculatedCR();
    const location = ENCOUNTER_PREFERENCES.setting;
    let i = 0;
    let enemyList = [];
    while (i < masterEnemyArray.length) {
        let currentMasterEnemyArrayEntry = masterEnemyArray[i];
        if (currentMasterEnemyArrayEntry.cr <= maxEnemyCR && currentMasterEnemyArrayEntry.cr >= maxEnemyCR/16 && currentMasterEnemyArrayEntry.potentialLocations.includes(location) == true && (currentMasterEnemyArrayEntry.enemyType == enemyType || enemyType == "all") && (enemyName == undefined || currentMasterEnemyArrayEntry.name == enemyName)) {
            enemyList.push(masterEnemyArray[i]);
            i++;
        } else {
            i++;
        }
    }
    return enemyList;
}

function populateNonCombatEncounters() {
    const SETTING = ENCOUNTER_PREFERENCES.setting;
    potentialEncounters = [];
    let i = 0;
    while (i<masterEncounterArray.length) {
        if (masterEncounterArray[i].location.includes(SETTING)) potentialEncounters.push(masterEncounterArray[i]);
        i++;
    }
    return;
}

function populateCombatEncounters() {
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

function fillCurrentEncounterObj(encounterObject) {
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
        PARAGRAPH.innerHTML = "<p>" + enemy.name + " - " + "XP: " + enemy.xpVal + "</p>";
        ENCOUNTER_ENEMIES_DISPLAY.insertAdjacentElement("beforeend", PARAGRAPH);
    });
    console.log("Please Help");
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