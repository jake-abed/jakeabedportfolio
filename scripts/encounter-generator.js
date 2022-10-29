"use strict";
/*
Preferences Object - Contains the preferences from the user input.
*/
const encounterPreferences = { //Set to default values
    setting: "random",
    combat: false,
    extraHard: false,
}

const encounter0 = {
    location: ["random", "city"],
    combat: false,
    extraHard: false,
    title: "A shady merchant approaches...",
    description:    "A small human man approaches the party claiming to be a merchant. He says he has small trinkets to peddle. When speaking as this character, be sure to ramble. When asked about his wares, he's going to be evasive and vague. Truthfully, he's trying to stall and pickpocket a random party member. Roll for sleight of hand plus 5. He'll try to steal up to 5 gold coins, three times. If he succeeds, he'll show the party some random junk then leave suddenly and angrily. If the party detects him, they get the reward!",
    reward: "100 xp and 10 gold.",
    dmNotes: "Adjust amount stolen, XP, and reward gold as needed for high level parties. Consider having him not steal from struggling players.",
}

const encounter1 = {
    location: ["random", "city", "outdoors"],
    combat: false,
    extraHard: false,
    title: "A decrepit priest cries out for alms and prayers...",
    description: "The party notices the tragic cries of a worn-down, old priest nearby. He is begging for prayers and potentially alms of any kind. The priest will lament that too few people pay him any mind and that the world needs more positivity and prayer. He makes sure to mention that any charity will do. When asked, his god will be whatever the local god is. If you are uncertain, insert a generic sun god nearby. For the cloud sea setting, he's worshipping the First God. There are no skill checks here, just a chance for the players to interact with a sad old man. If the players are kind and give him something, he will thank them and promise to pray for them. If the players pray with him, he will lead them in a quick, positive prayer and send them on their way.",
    reward: "None, potentially clemency from the DM in the future.",
    dmNotes: "You can weave this into your story or just have this be an ethics check on your players.",
}

const encounter2 = {
    location: ["cloudsea"],
    combat: false,
    extraHard: false,
    title: "An airship restaurant approaches...",
    description: "A lively restaurant, known as 'The Noodly Appendage' based out of an airship approaches the party. They serve noodles, fried chicken, and sky whale porridge. If the players engage with the proprietors, they get delicous food and a information about a famous restaurant in Polpizu (Polpran City) named 'Sumptuous Blizzard' operated by a Kenku chef known as Ogreel van Kreuzh.",
    reward: "No reward, just good food and info.",
    dmNotes: "Let the players linger in this one. Great for repeat events if you want them to decompress."
}

const encounter3 = {
    location: ["random", "outdoors", "dungeon"],
    combat: false,
    extraHard: false,
    title: "A glowing orb with a disempbodied voice approaches...",
    description: "A glowing orb with a disembodied and monstrously booming voice approaches from behind a nearby object. Tree, coffin, building, whatever. It says that if you can answer its riddles and questions correctly, it will reward you handsomely. The first one is a riddle: 'We can be fast, we can be slow, We sometimes fly yet fall so low. We bring bout life, we can also kill.  Many & everywhere, we are hot, cold, moving, or still. Who are we?' The answer is 'We Are Water'. If they clown the light for riddle being mediocre, he suggests they come up with a better one. The second question is history check or theology check on the land. DC 15. For the Cloud Sea, the question is 'What year was the dissolution of the first Aarokocran Dominion?' The answer is '0 PD or 0 Post Dominion' as a kind of trick question. The final question is 'Three children have three loaves of bread each. They invite three more friends over, each with one loaf of bread. They then slice each loaf of bread into nine slices. They then invite over three more friends, then divide the bread evenly amongst them all. Assuming each child is only hungry enough to eat two slices of bread (there is some jam and butter as well), how many loaves are left over?' The answer is 4.",
    reward: "Ring Of Truths",
    dmNotes: "This one's a doozy. Have fun.",
}

const encounter4 = {
    location: ["dungeon", "city"],
    combat: false,
    extraHard: false,
    title: "A small gargoyle sits abjectly in the corner of the room.",
    description: "The tiniest gargoyle sits in the corner of the room, looking immensely gloomy. He says he lost his staff and can't prop himself menacingly on any parapets or columns. If the party searches the room, they'll notice that the gargoyle's staff is under a large pile of rubble. DC 10 perception. To clear the rubble, it'll require a strength check of DC 20 - 5 per participating player. A DC 15 perception check will reveal two opaline gems about a half inch in diameter in the rubble. They are the gargoyle's eyes.",
    reward: "If they keep the opals, they are worth 20gp each. If they return the opals, the gargoyle will offer to accompany them on their journey. He has 200 HP, can carry one item for the party, has 20 AC, but only deals 1d4 damager with a +5 attack modifier. He's very weak.",
    dmNotes: "The small gargoyle's name is Grostni and he likes blood-splattered walls, the smell of noodles, and cats.",
}

const encounter5 = {
    location: ["random", "outdoors", "city", "cloudsea"],
    combat: false,
    extraHard: false,
    title: "A bird shits on a random player's head.",
    description: "A large white and grey bird craps on one of the player's heads.",
    reward: "Nope.",
    dmNotes: "Yeah, they can't all be zingers. Variety is the spice of life.",
}

const encounter6 = {
    location: ["random", "city", "outdoors", "cloudsea"],
    combat: false,
    extraHard: false,
    title: "A bird starts squawking and drops an envelope...",
    description: "A hawk-like bird drops a wax-sealed envelope with the players, then flies away. The envelope contains a brief letter saying, 'If you are reading this letter, my familiar has determined that you are a good candidate to assist with a task. We need help transporting a sensitive and fragile item. Please come to the Grand Cloister on the center of Polpran and ask for Miztrum the Eye.'",
    reward: "A potential quest.",
    dmNotes: "Story hook for the players. Feel free to change details, but the general prompt of receiving a quest letter is always great.",
}

const encounter7 = {
    location: ["random", "outdoors", "dungeon"],
    combat: false,
    extraHard: false,
    title: "A man is trapped under debris...",
    description: "A muscular, but extremely wounded man is trapped underneath debris. If outdoors, it's a tree or some stones. In a dungeon, it could be a trap or stone or a collapsed wall. Either way, a DC 20 strength check (lowered by 5 for each participating player) will free him. Or if the player's spend 2d4 hours, they can free him. Once freed, he will reward the players and start running away. He'll be muttering, 'Verlacht is gonna kill me...' while leaving. If the player's don't save him, he'll scream incessantly until out of earshot.",
    reward: "TBD, maybe 50 gold.",
    dmNotes: "Use the Verlacht bit or not. Who is he? A merchant? Bandit leader? General?",
}

const encounter8 = {
    location: ["random", "outdoors", "dungeon", "city", "cloudsea"],
    combat: true,
    extraHard: false,
    title: "Test for combat logic and looping.",
    description: "How many iterations will it take to get this one?",
}

const encounter9 = {
    location: ["random", "outdoors", "dungeon", "city"],
    combat: true,
    extraHard: false,
    title: "Test 2 for combat logic and looping.",
    description: "How many iterations will it take to get this second one?",
}

let encounterMap = new Map([
    [0, encounter0],
    [1, encounter1],
    [2, encounter2],
    [3, encounter3],
    [4, encounter4],
    [5, encounter5],
    [6, encounter6],
    [7, encounter7],
    [8, encounter8],
    [9, encounter9],
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

let loopNumber = 1;

function randomEncounter() {
    const encounterPick = encounterMap.get(Math.floor((Math.random()*10)));
    const encounterPickLocation = encounterPick.location; 
    const encounterPickCombat = encounterPick.combat;
    if (!encounterPickLocation.includes(encounterPreferences.setting)) {
        console.log("This has looped " + loopNumber + " times.");
        loopNumber++;
        return randomEncounter();
    }
    if (!encounterPickCombat == encounterPreferences.combat) {
        console.log("This has looped " + loopNumber + " times.");
        loopNumber++;
        return randomEncounter();
    }
    encounterTitleDisplay.innerHTML = encounterPick.title;
    encounterDescriptionDisplay.innerHTML = encounterPick.description;
    encounterPick.reward ? encounterRewardDisplay.innerHTML = encounterPick.reward : encounterRewardDisplay.innerHTML = "Oops! Lazy DM/Coder didn't finish his work.";
    encounterPick.dmNotes ? encounterDMNotesDisplay.innerHTML = encounterPick.dmNotes : encounterDMNotesDisplay.innerHTML = "Sorry, the DM/Coder fucked up.";
    loopNumber = 1;
    return;
}

generateEncounterButton.addEventListener("click", updateEncounterPreferences, false);
generateEncounterButton.addEventListener("click", randomEncounter, false);
generateEncounterButton.addEventListener("click", logDumbMessage, false);