"use strict";
/*
Preferences Object - Contains the preferences from the user input.
*/
const encounterPreferences = { //Set to default values
    setting: "random",
    combat: false,
    extraHard: false,
}

let encounter001 = {
    location: ["random", "city"],
    combat: true,
    extraHard: false,
    title: "A shady merchant approaches...",
    description:    "A small human man approaches the party claiming to be a merchant. He says he has small trinkets to peddle. When speaking as this character, be sure to ramble. When asked about his wares, he's going to be evasive and vague. Truthfully, he's trying to stall and pickpocket a random party member. Roll for sleight of hand plus 5. He'll try to steal up to 5 gold coins, three times. If he succeeds, he'll show the party some random junk then leave suddenly and angrily. If the party detects him, they get the reward!",
    reward: "100 xp and 10 gold.",
    dmNotes: "Adjust amount stolen, XP, and reward gold as needed for high level parties. Consider having him not steal from struggling players.",
}

const nonCombatEncounter = { //A sample noncombat encounter to see what I want to return?
    nonCombat: true,
    setting: undefined,//create a function to choose a setting based off of user input.
    title: "A shady merchant approaches your party...",
    npc: undefined,
    description: `Steve approaches your party, surreptitiously asking, "Wouldst though like any wares?" But truthfully he simply wishes to swindle the party. Choose a random party member and Steve will try to pickpocket them. He\'s pretty weak and has no associates. No bonuses either way. If caught he'll run.`,
    rewards: "10 gp & a ladle",
}

const generateEncounterButton = document.getElementById("annoying-button"),
encounterSettingValue = document.getElementById("encounter-setting"),
nonCombatValue = document.getElementById("is-combat"),
extraHardValue = document.getElementById("extra-hard");


function logDumbMessage() {
    return console.log(encounter001);
}

function updateEncounterPreferences() {
    encounterPreferences.setting = encounterSettingValue.value;
    encounterPreferences.combat = (nonCombatValue.value === "true");
    encounterPreferences.extraHard = (extraHardValue.value === "true");
}

generateEncounterButton.addEventListener("click", updateEncounterPreferences, false);
generateEncounterButton.addEventListener("click", logDumbMessage, false);