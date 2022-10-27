"use strict";
/*
Preferences Object - Contains the preferences from the user input.
*/
const encounterPreferences = { //Set to default values
    setting: "random",
    combat: false,
    extraHard: false,
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
    return console.log(encounterPreferences);
}

function updateEncounterPreferences() {
    encounterPreferences.setting = encounterSettingValue.value;
    encounterPreferences.combat = (nonCombatValue.value === "true");
    encounterPreferences.extraHard = (extraHardValue.value === "true");
}

generateEncounterButton.addEventListener("click", updateEncounterPreferences, false);
generateEncounterButton.addEventListener("click", logDumbMessage, false);