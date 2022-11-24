"use strict";

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
        if (this.combat == true) {
            this.possibleEnemyList = createPossibleEnemyList(this.maxEnemyCR, this.setting, "all");
        }
        return this;
    },
}

const CURRENT_ENCOUNTER = {
    title: null,
    description: null,
    requiredEnemy: null,
    enemyType: null,
    singleEnemy: null,
    requiredEnemy:null,
    minCR: null,
    maxCR: null,
    rewardTable: null,
    dmNotes: null,
    enemies: null,
    reward: function () {
        return selectRandomArrayEntry(this.rewardTable);
    },
    potentialEnemies: function () {
        if (!this.requiredEnemy) {
            return this.possibleEnemyList = createPossibleEnemyList(this.enemyType);
        } return this.possibleEnemyList = createPossibleEnemyList(this.enemyType, this.requiredEnemy);
    }
}

let loopBreakpoint = 200; //If this reaches zero, the random generation was too inefficient and errors out.

const MASTER_ENCOUNTER_ARRAY = [
    {
        location: ["random", "city"],
        combat: false,
        title: "A shady merchant approaches...",
        description:    "A small human man approaches the party claiming to be a merchant. He says he has small trinkets to peddle. When speaking as this character, be sure to ramble. When asked about his wares, he's going to be evasive and vague. Truthfully, he's trying to stall and pickpocket a random party member. Roll for sleight of hand plus 5. He'll try to steal up to 5 gold coins, three times. If he succeeds, he'll show the party some random junk then leave suddenly and angrily. If the party detects him, they get the reward!",
        rewardTable: ["100 xp and 10 gold.", "100xp and 20 gold.", "100xp and 5 gold."],
        dmNotes: "Adjust amount stolen, XP, and reward gold as needed for high level parties. Consider having him not steal from struggling players."
    },

    {
        location: ["random", "city", "outdoors"],
        combat: false,
        title: "A decrepit priest cries out for alms and prayers...",
        description: "The party notices the tragic cries of a worn-down, old priest nearby. He is begging for prayers and potentially alms of any kind. The priest will lament that too few people pay him any mind and that the world needs more positivity and prayer. He makes sure to mention that any charity will do. When asked, his god will be whatever the local god is. If you are uncertain, insert a generic sun god nearby. For the cloud sea setting, he's worshipping the First God. There are no skill checks here, just a chance for the players to interact with a sad old man. If the players are kind and give him something, he will thank them and promise to pray for them. If the players pray with him, he will lead them in a quick, positive prayer and send them on their way.",
        rewardTable: ["None, potentially clemency from the DM in the future.", "A small effigy of the priest's god."],
        dmNotes: "You can weave this into your story or just have this be an ethics check on your players."
    },

    {
        location: ["cloudsea"],
        combat: false,
        title: "An airship restaurant approaches...",
        description: "A lively restaurant, known as 'The Noodly Appendage' based out of an airship approaches the party. They serve noodles, fried chicken, and sky whale porridge. If the players engage with the proprietors, they get delicous food and a information about a famous restaurant in Polpizu (Polpran City) named 'Sumptuous Blizzard' operated by a Kenku chef known as Ogreel van Kreuzh.",
        rewardTable: ["No reward, just good food and info."],
        dmNotes: "Let the players linger in this one. Great for repeat events if you want them to decompress."
    },

    {
        location: ["random", "outdoors", "dungeon"],
        combat: false,
        title: "A glowing orb with a disembodied voice approaches...",
        description: "A glowing orb with a disembodied and monstrously booming voice approaches from behind a nearby object. Tree, coffin, building, whatever. It says that if you can answer its riddles and questions correctly, it will reward you handsomely. The first one is a riddle: 'We can be fast, we can be slow, We sometimes fly yet fall so low. We bring bout life, we can also kill.  Many & everywhere, we are hot, cold, moving, or still. Who are we?' The answer is 'We Are Water'. If they clown the light for riddle being mediocre, he suggests they come up with a better one. The second question is history check or theology check on the land. DC 15. For the Cloud Sea, the question is 'What year was the dissolution of the first Aarokocran Dominion?' The answer is '0 PD or 0 Post Dominion' as a kind of trick question. The final question is 'Three children have three loaves of bread each. They invite three more friends over, each with one loaf of bread. They then slice each loaf of bread into nine slices. They then invite over three more friends, then divide the bread evenly amongst them all. Assuming each child is only hungry enough to eat two slices of bread (there is some jam and butter as well), how many loaves are left over?' The answer is 4.",
        rewardTable: ["Ring Of Truths"],
        dmNotes: "This one's a doozy. Have fun.",
    },

    {
        location: ["dungeon", "city"],
        combat: false,
        title: "A small gargoyle sits abjectly in the corner of the room.",
        description: "The tiniest gargoyle sits in the corner of the room, looking immensely gloomy. He says he lost his staff and can't prop himself menacingly on any parapets or columns. If the party searches the room, they'll notice that the gargoyle's staff is under a large pile of rubble. DC 10 perception. To clear the rubble, it'll require a strength check of DC 20 - 5 per participating player. A DC 15 perception check will reveal two opaline gems about a half inch in diameter in the rubble. They are the gargoyle's eyes.",
        rewardTable: ["If they keep the opals, they are worth 20gp each. If they return the opals, the gargoyle will offer to accompany them on their journey. He has 200 HP, can carry one item for the party, has 20 AC, but only deals 1d4 damager with a +5 attack modifier. He's very weak."],
        dmNotes: "The small gargoyle's name is Grostni and he likes blood-splattered walls, the smell of noodles, and cats.",
    },

    {
        location: ["random", "outdoors", "city", "cloudsea"],
        combat: false,
        title: "A bird shits on a random player's head.",
        description: "A large white and grey bird craps on one of the player's heads.",
        rewardTable: ["Poop.", "Nothing.", "A sense of pride and accomplishment."],
        dmNotes: "Yeah, they can't all be zingers. Variety is the spice of life."
    },

    {
        location: ["random", "city", "outdoors", "cloudsea"],
        combat: false,
        title: "A bird starts squawking and drops an envelope...",
        description: "A hawk-like bird drops a wax-sealed envelope with the players, then flies away. The envelope contains a brief letter saying, 'If you are reading this letter, my familiar has determined that you are a good candidate to assist with a task. We need help transporting a sensitive and fragile item. Please come to the Grand Cloister on the center of Polpran and ask for Miztrum the Eye.'",
        rewardTable: ["A potential quest."],
        dmNotes: "Story hook for the players. Feel free to change details, but the general prompt of receiving a quest letter is always great.",
    },

    {
        location: ["random", "outdoors", "dungeon"],
        combat: false,
        title: "A man is trapped under debris...",
        description: "A muscular, but extremely wounded man is trapped underneath debris. If outdoors, it's a tree or some stones. In a dungeon, it could be a trap or stone or a collapsed wall. Either way, a DC 20 strength check (lowered by 5 for each participating player) will free him. Or if the player's spend 2d4 hours, they can free him. Once freed, he will reward the players and start running away. He'll be muttering, 'Verlacht is gonna kill me...' while leaving. If the player's don't save him, he'll scream incessantly until out of earshot.",
        rewardTable: ["TBD, maybe 50 gold."],
        dmNotes: "Use the Verlacht bit or not. Who is he? A merchant? Bandit leader? General?",
    },

    {
        location: ["random", "outdoors", "dungeon", "city", "cloudsea"],
        combat: false,
        title: "Test for logic and missing properties.",
        rewardTable: ["A dog"],
        description: "I'm really feeling this project right now.",
    },

    {
        location: ["random", "outdoors", "dungeon", "city"],
        combat: false,
        title: "Yet another test for logic and iterations.",
        rewardTable: ["A bottle of alcohol"],
        description: "Sheesh man.",
    },
    
    {
        location: ["random", "outdoors", "city"],
        combat: false,
        title: "You find a tortle, lying on his back helplessly...",
        description: "Who here has seen Blade Runner? This Tortle is just not having a good time. He's older, disheveled, and kind of dumpy looking right now. Can you blame him. He's just sobbing gently. Asking questions does nothing, poor dude is a just a total wreck.",
        rewardTable: ["A letter of recommendation to join 'The Flying Flask' in Tiupran City", "A letter of recommendation to join 'Shifty Sevens Dice Club' in Tiupran City"],
        dmNotes: "This is something of a goofy reference one."
    }
];

/*MASTER_COMBAT_ENCOUNTER_ARRAY object template : 
    {
        title:
        locations:
        minCR:
        description:
        enemyType:
        singleEnemy:
        rewardTable:
        dmNotes:
    }

*/

const MASTER_COMBAT_ENCOUNTER_ARRAY = [
    {
        title: "A lone monster lunges from the shadow and attacks your party!",
        locations: ["random", "city", "outdoors", "dungeon", "cloudsea"],
        minCR: 4,
        maxCR: 120,
        description: "Your party is just minding it's business doing their thing, where a single monster lunges out of nowhere. It targets a random player and starts with advantage.",
        enemyType: "monster",
        singleEnemy: true,
        rewardTable: ["3gp per CR", "A ring of resistance (DM's choice)", "Ring of Jumping", "An Amulet of a Random God", "A +1 Bastard Sword"],
        dmNotes: "Feel free to sub out the monster for something more thematically appropriate."
    },
    {
        title: "A whizzing sound grows...",
        locations: ["cloudsea"],
        minCR: 4,
        maxCR: 56,
        description: "A harsh whizzing sound begins growing as a rabid animal plummets from the sky like a comet.",
        enemyType: "animal",
        singleEnemy: true,
        rewardTable: ["The animal's meat", "The animal has a tag attached to it that reads 'University of Aarakocra Tagging Project'", "Partially eaten glizzy"],
        dmNotes: "If the enemy generated cannot fly, sub in something different."
    },
    {
        title: "A group of random undead enemies attack!",
        locations: ["random", "outdoors", "dungeon", "cloudsea"],
        minCR: 4,
        maxCR: 960,
        description: "What is this, Final Fantasy? It's just a ton of undead creatures attacking.",
        enemyType: "undead",
        singleEnemy: false,
        rewardTable: ["1gp per CR", "Underwear", "A signet ring with the initials D.R.P.", "1 ration per CR"],
        dmNotes: "This is a generic combat encounter for generic times."
    },
    {
        title: "An assassin lunges out of the dark and attacks!",
        locations: ["random", "city", "outdoors", "dungeon"],
        minCR: 64,
        maxCR: 80,
        description: "If the assassin is undetected, he gets advantage on the player he attacks. The assassin is human, swathed in blue-black cloth and leather, and utterly silent. If subdued before dying, he will reveal his goal.",
        enemyType: "npc",
        requiredEnemy: "Assassin",
        singleEnemy: true,
        rewardTable: ["A bag containing 3 diamonds, 5 rubies, and 3 emeralds.", "100gp and a letter with the party's names on it addressed from Kestron Yarona.", "A Ring of Invisibility"],
        dmNotes: "Make the assassin's goal work into a plot beat. Also, have each party member roll a perception check at the begining of the encounter. A 20 will reveal the assassin, preventing advantage."
    },
];

/*
Master enemy array template:
    {name: string, potentialLocations: [array of strings], enemyType: string, cr: num, xpVal: num}
*/

const MASTER_ENEMY_ARRAY= [
    {name: "Bandit", potentialLocations: ["random", "city", "outdoors"], enemyType: "npc", cr: 1, xpVal: 25,},
    {name: "Wererat", potentialLocations: ["random", "city", "outdoors", "dungeon"], enemyType: "monster", cr: 16, xpVal: 350},
    {name: "Grell", potentialLocations: ["random", "outdoors", "dungeon", "cloudsea"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Flying Snake", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "animal", cr: 1, xpVal: 25},
    {name: "Gargoyle", potentialLocations: ["random", "cloudsea", "city", "dungeon"], enemyType: "construct", cr: 16, xpVal: 450},
    {name: "Killer Sky Whale", potentialLocations: ["cloudsea"], enemyType: "animal", cr: 24, xpVal: 700},
    {name: "Pirate (Thug)", potentialLocations: ["city", "cloudsea"], enemyType: "npc", cr: 4, xpVal: 100},
    {name: "Dire Wolf", potentialLocations: ["random", "outdoors"], enemyType: "animal", cr: 8, xpVal: 200},
    {name: "Stirge", potentialLocations: ["random", "outdoors", "dungeon", "cloudsea"], enemyType: "monster", cr: 1, xpVal: 25},
    {name: "Skeleton", potentialLocations: ["random", "outdoors", "dungeon"], enemyType: "undead", cr: 1, xpVal: 50},
    {name: "Peryton", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "monster", cr: 16, xpVal: 450},
    {name: "Gelatinous Cube", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 2, xpVal: 450},
    {name: "Quadrone", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "construct", cr: 8, xpVal: 200},
    {name: "Giant Eagle", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "animal", cr: 8, xpVal: 200},
    {name: "Imp", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "monster", cr: 8, xpVal: 200},
    {name: "Darkmantle", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "monster", cr: 4, xpVal: 100},
    {name: "Hippogriff", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "monster", cr: 8, xpVal: 200},
    {name: "Specter", potentialLocations: ["random", "city", "dungeon", "cloudsea"], enemyType: "undead", cr: 8, xpVal: 200},
    {name: "Will-o-Wisp", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "undead", cr: 16, xpVal: 450},
    {name: "Rug Of Smothering AKA YR MOM", potentialLocations: ["random", "city", "cloudsea"], enemyType: "construct", cr: 16, xpVal: 450},
    {name: "Scarecrow", potentialLocations: ["random", "outdoors"], enemyType: "construct", cr: 8, xpVal: 200},
    {name: "Winged Kobold", potentialLocations: ["random", "outdoors", "cloudsea"], enemyType: "npc", cr: 2, xpVal: 50},
    {name: "Helmed Horror", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "construct", cr: 32, xpVal: 1100},
    {name: "Flesh Golem", potentialLocations: ["random", "dungeon"], enemyType: "construct", cr: 40, xpVal: 1800},
    {name: "Pentadrone", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "construct", cr: 16, xpVal: 450},
    {name: "Clay Golem", potentialLocations: ["random", "dungeon"], enemyType: "construct", cr: 72, xpVal: 5000},
    {name: "Githyanki Warrior", potentialLocations: ["random", "dungeon"], enemyType: "npc", cr: 24, xpVal: 700},
    {name: "Drow Elite Warrior", potentialLocations: ["random", "dungeon"], enemyType: "npc", cr: 40, xpVal: 1800},
    {name: "Assassin", potentialLocations: ["random", "city", "dungeon", "cloudsea"], enemyType: "npc", cr: 64, xpVal: 3900},
    {name: "Drider", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 48, xpVal: 2300},
    {name: "Bulette", potentialLocations: ["random", "outdoors"], enemyType: "monster", cr: 40, xpVal: 1800},
    {name: "Phase Spider", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Roper", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 40, xpVal: 1800},
    {name: "Yuan-Ti Malison", potentialLocations: ["random", "dungeon", "cloudsea"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Yuan-Ti Abomination", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 56, xpVal: 2900},
    {name: "Minotaur", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Owlbear", potentialLocations: ["random", "outdoors"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Hydra", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 64, xpVal: 3900},
    {name: "Behir", potentialLocations: ["random", "outdoors", "dungeon"], enemyType: "monster", cr: 88, xpVal: 7200},
    {name: "Doppelganger", potentialLocations: ["random", "city", "outdoors", "dungeon"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Basilisk", potentialLocations: ["random", "dungeon"], enemyType: "monster", cr: 24, xpVal: 700},
    {name: "Bone Naga", potentialLocations: ["random", "dungeon"], enemyType: "undead", cr: 32, xpVal: 1100},
    {name: "Wraith", potentialLocations: ["random", "city", "outdoors", "cloudsea", "dungeon"], enemyType: "undead", cr: 40, xpVal: 1800},
    {name: "Banshee", potentialLocations: ["random", "city", "outdoors", "dungeon", "cloudsea"], enemyType: "undead", cr: 32, xpVal: 1100},
    {name: "Vampire Spawn", potentialLocations: ["random", "city", "outdoors", "dungeon"], enemyType: "undead", cr: 40, xpVal: 1800},
    {name: "Vampire", potentialLocations: ["random", "city", "outdoors", "dungeon", "cloudsea"], enemyType: "undead", cr: 104, xpVal: 10000},
    {name: "Young Copper Dragon", potentialLocations: ["random", "city", "outdoors", "cloudsea"], enemyType: "dragon", cr: 56, xpVal: 2900},
    {name: "Young Red Dragon", potentialLocations: ["random", "city", "outdoors", "cloudsea", "dungeon"], enemyType: "dragon", cr: 80, xpVal: 5900},
    {name: "Young Blue Dragon", potentialLocations: ["random", "city", "outdoors", "cloudsea", "dungeon"], enemyType: "dragon", cr: 72, xpVal: 5000},
    {name: "Adult Black Dragon", potentialLocations: ["random", "city", "outdoors", "cloudsea", "dungeon"], enemyType: "dragon", cr: 112, xpVal: 11500}
]

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
        if (currentMasterEnemyArrayEntry.cr <= maxEnemyCR && currentMasterEnemyArrayEntry.potentialLocations.includes(location) == true && (currentMasterEnemyArrayEntry.enemyType == enemyType || enemyType == "all") && (enemyName == undefined || currentMasterEnemyArrayEntry.name == enemyName)) {
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

function fillMonsters() {
    const MAX_CR = ENCOUNTER_PREFERENCES.calculatedCR();
    let remainingCR = MAX_CR;
}

function createRandomEncounter() {
    console.time();
    ENCOUNTER_PREFERENCES.update();
    if (ENCOUNTER_PREFERENCES.combat == false) populateNonCombatEncounters();
    if (ENCOUNTER_PREFERENCES.combat == true) populateCombatEncounters();
    return console.log(selectRandomArrayEntry(potentialEncounters));
}

GENERATE_ENCOUNTER_BUTTON.addEventListener("click", createRandomEncounter, false);