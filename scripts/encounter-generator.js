"use strict";

import MASTER_ENEMY_ARRAY from "../data/encounter-generator/MASTER_ENEMY_ARRAY.json" assert {type: "json"};
import MASTER_ENCOUNTER_ARRAY from "../data/encounter-generator/MASTER_ENCOUNTER_ARRAY.json" assert {type: "json"};
import MASTER_COMBAT_ENCOUNTER_ARRAY from "../data/encounter-generator/MASTER_COMBAT_ENCOUNTER_ARRAY.json" assert {type: "json"};

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
    while (i < MASTER_ENEMY_ARRAY.length) {
        let currentMasterEnemyArrayEntry = MASTER_ENEMY_ARRAY[i];
        if (currentMasterEnemyArrayEntry.cr <= maxEnemyCR && currentMasterEnemyArrayEntry.cr >= maxEnemyCR/16 && currentMasterEnemyArrayEntry.potentialLocations.includes(location) == true && (currentMasterEnemyArrayEntry.enemyType == enemyType || enemyType == "all") && (enemyName == undefined || currentMasterEnemyArrayEntry.name == enemyName)) {
            enemyList.push(MASTER_ENEMY_ARRAY[i]);
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
    while (i<MASTER_ENCOUNTER_ARRAY.length) {
        if (MASTER_ENCOUNTER_ARRAY[i].location.includes(SETTING)) potentialEncounters.push(MASTER_ENCOUNTER_ARRAY[i]);
        i++;
    }
    return;
}

function populateCombatEncounters() {
    const SETTING = ENCOUNTER_PREFERENCES.setting;
    const CR = ENCOUNTER_PREFERENCES.calculatedCR();
    potentialEncounters = [];
    let i = 0;
    while (i<MASTER_COMBAT_ENCOUNTER_ARRAY.length) {
        if (MASTER_COMBAT_ENCOUNTER_ARRAY[i].locations.includes(SETTING) && (MASTER_COMBAT_ENCOUNTER_ARRAY[i].minCR <= CR+2) && (CR <= MASTER_COMBAT_ENCOUNTER_ARRAY[i].maxCR)) {
            potentialEncounters.push(MASTER_COMBAT_ENCOUNTER_ARRAY[i]);
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
        ENCOUNTER_ENEMIES_DISPLAY.innerHTML += "<p>" + enemy.name + " - " + "XP: " + enemy.xpVal + "</p>";
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