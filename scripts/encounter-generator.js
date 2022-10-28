"use strict";
/*
Preferences Object - Contains the preferences from the user input.
*/
const encounterPreferences = { //Set to default values
    setting: "random",
    combat: false,
    extraHard: false,
}

let encounter0 = {
    location: ["random", "city"],
    combat: false,
    extraHard: false,
    title: "A shady merchant approaches...",
    description:    "A small human man approaches the party claiming to be a merchant. He says he has small trinkets to peddle. When speaking as this character, be sure to ramble. When asked about his wares, he's going to be evasive and vague. Truthfully, he's trying to stall and pickpocket a random party member. Roll for sleight of hand plus 5. He'll try to steal up to 5 gold coins, three times. If he succeeds, he'll show the party some random junk then leave suddenly and angrily. If the party detects him, they get the reward!",
    reward: "100 xp and 10 gold.",
    dmNotes: "Adjust amount stolen, XP, and reward gold as needed for high level parties. Consider having him not steal from struggling players.",
}

let encounter1 = {
    location: ["random", "city", "outdoors"],
    combat: false,
    extraHard: false,
    title: "A decrepit priest cries out for alms and prayers...",
    description: "The party notices the tragic cries of a worn-down, old priest nearby. He is begging for prayers and potentially alms of any kind. The priest will lament that too few people pay him any mind and that the world needs more positivity and prayer. He makes sure to mention that any charity will do. When asked, his god will be whatever the local god is. If you are uncertain, insert a generic sun god nearby. For the cloud sea setting, he's worshipping the First God. There are no skill checks here, just a chance for the players to interact with a sad old man. If the players are kind and give him something, he will thank them and promise to pray for them. If the players pray with him, he will lead them in a quick, positive prayer and send them on their way.",
    reward: "None, potentially clemency from the DM in the future.",
    dmNotes: "You can weave this into your story or just have this be an ethics check on your players.",
}

let encounter2 = {
    location: ["cloudsea"],
    combat: false,
    extraHard: false,
    title: "An airship restaurant approaches...",
    description: "A lively restaurant, known as 'The Noodly Appendage' based out of an airship approaches the party. They serve noodles, fried chicken, and sky whale porridge. If the players engage with the proprietors"
}

let encounter3 = {
    location: ["random", "outdoors", "dungeon"],
    combat: false,
    extraHard: false,
    title: "A glowing orb with a disempbodied voice approaches...",
    description: "A glowing orb with a disembodied and monstrously booming voice approaches from behind a nearby object. Tree, coffin, building, whatever. It says that if you can answer its riddles and questions correctly, it will reward you handsomely. The first one is a riddle: 'We can be fast, we can be slow, We sometimes fly yet fall so low. We bring bout life, we can also kill.  Many & everywhere, we are hot, cold, moving, or still. Who are we?' The answer is 'We Are Water'. If they clown the light for riddle being mediocre, he suggests they come up with a better one. The second question is history check or theology check on the land. DC 15. For the Cloud Sea, the question is 'What year was the dissolution of the first Aarokocran Dominion?' The answer is '0 PD or 0 Post Dominion' as a kind of trick question. The final question is 'Three children have three loaves of bread each. They invite three more friends over, each with one loaf of bread. They then slice each loaf of bread into nine slices. They then invite over three more friends, then divide the bread evenly amongst them all. Assuming each child is only hungry enough to eat two slices of bread (there is some jam and butter as well), how many loaves are left over?' The answer is 4.",
    reward: "Ring Of Truths",
    dmNotes: "This one's a doozy. Have fun."
}

let encounterMap = new Map([
    [0, encounter0],
    [1, encounter1],
    [2, encounter2],
    [3, encounter3],
]);

const generateEncounterButton = document.getElementById("annoying-button"),
      encounterSettingValue = document.getElementById("encounter-setting"),
      nonCombatValue = document.getElementById("is-combat"),
      extraHardValue = document.getElementById("extra-hard"),
      encounterTitleDisplay = document.getElementById("encounter-title"),
      encounterDescriptionDisplay = document.getElementById("encounter-description"),
      encounterRewardDisplay = document.getElementById("encounter-rewards"),
      encounterDMNotesDisplay = document.getElementById("encounter-dm-notes");


function logDumbMessage() {
    return console.log(encounterPreferences);
}

function updateEncounterPreferences() {
    encounterPreferences.setting = encounterSettingValue.value;
    encounterPreferences.combat = (nonCombatValue.value === "true");
    encounterPreferences.extraHard = (extraHardValue.value === "true");
}

function randomEncounter() {
    let encounterPick = encounterMap.get(Math.floor((Math.random()*4)));
    let encounterPickLocation = encounterPick.location;
    if (!encounterPickLocation.includes(encounterPreferences.setting)) {
        return randomEncounter();
    }
    encounterTitleDisplay.innerHTML = encounterPick.title;
    encounterDescriptionDisplay.innerHTML = encounterPick.description;
    encounterPick.reward ? encounterRewardDisplay.innerHTML = encounterPick.reward : encounterRewardDisplay.innerHTML = "Oops! Lazy DM/Coder didn't finish his work.";
    encounterPick.dmNotes ? encounterDMNotesDisplay.innerHTML = encounterPick.dmNotes : encounterDMNotesDisplay.innerHTML = "Sorry, the DM/Coder fucked up."
    return;
}

generateEncounterButton.addEventListener("click", updateEncounterPreferences, false);
generateEncounterButton.addEventListener("click", randomEncounter, false);
generateEncounterButton.addEventListener("click", logDumbMessage, false);