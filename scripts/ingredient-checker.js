"use strict";

const ingredientDictionary = ["Acetylated Lanolin", "Acetylated Lanolin Alcohol", "Ahnfeltia Concinna Extract", "Algae", "Algae Extract", "Algin", "Almond Oil", "Argan Oil", "Argania Spinosa (Argan) Oil", "Argania Spinosa Oil", "Ascophyllum Nodosum", "Avocado Butter", "Avocado Oil", "Persea Gratissima (Avocado) Butter", "Persea Gratissima (Avocado) Oil", "Butyl Stearate", "Carrageenan", "Cetyl Acetate", "Cetearyl Alcohol + Ceteareth 20", "Chondrus Crispus", "Irish Moss", "Carageenan Moss", "Chlorella", "Coal Tar", "Cocoa Butter", "Coconut Alkanes", "Coconut Butter", "Coconut Oil", "Colloidal Sulfur", "Corn Oil", "Cotton Awws Oil", "Cotton Seed Oil", "D & C Red # 17", "D & C Red # 21", "D & C Red # 3", "D & C Red # 30", "D & C Red 36", "Decyl Oleate", "Dioctyl Succinate", "Disodim Monooleamido PEG 2-Sulfosuccinate", "Ethoxylated Lanolin", "Ethylhexyl Palmitate", "Glyceryl Stearate SE", "Glyceryl-3 Diisostearate", "Hexadecyl Alcohol", "Hydrogenated Vegetable Oil", "Hydrogenated", "Isocetyl Alcohol", "Isocetyl Stearate", "Isodecyl Oleate", "Isopropyl Isostearate", "Isopropyl Linolate", "Isopropyl Myristate", "Isopropyl Palmitate", "Isostearyl Isostearate", "Isotearyl Neopentanoate", "Kelp", "Laminaria Digitata Extract", "Laminaria Saccharina Extract", "Laminaria Saccharine", "Laureth-23", "Laureth-4", "Lauric Acid", "Lauroyl Lysine", "Mink Oil", "Myristic Acid", "Myristyl Lactate", "Myristyl Myristate", "Octyl Palmitate", "Octyl Stearate", "Oleth-3", "Oleyl Alcohol", "PEG 16 Lanolin", "PEG 200 Dilaurate", "PEG 8 Stearate", "PG Monostearate", "Phormidium Persicinum Extract", "PPG 2 Myristyl Propionate", "Plankton", "Polyglyceryl-3 Diisostearate", "Potassium Chloride", "Propylene Glycol Monostearate", "Red Algae", "Seaweed", "Sesamum Indicum (Sesame) Seed Oil", "Shark Liver Oil", "Squalene", "Shea Butter", "Butyrospermum Parkii (Shea) Butter", "Sodium Laureth Sulfate", "Sodium Lauryl Sulfate", "Solulan 16", "Sorbitan Oleate", "Soybean Oil", "Spirulina", "Steareth 10", "Stearic Acid Tea", "Stearyl Heptanoate", "Sulfated Castor Oil", "Sulfate Jojoba Oil", "Sweet Almond Oil", "Wheat Germ Glyceride", "Wheat Germ Oil", "Triticum Vulgare (Wheat) Germ Oil", "Xylene"];

let ingredientMessage = document.getElementById("acne-safe-response");
let processListButton = document.getElementById("annoying-button");
let ingredientInput = document.getElementById("ingredient-input");
let ingredientInputArray = [];
let isIngredientAcneCausing = (ingredient) => ingredientDictionary.includes(ingredient) ? ingredient + " " : false; // Check if the dictionary contains the ingredient.

processListButton.addEventListener("click", fillIngredientInputArray, false);
processListButton.addEventListener("click", updateResponseText, false);
processListButton.addEventListener("click", console.log(createAcneCausingIngredientReturn(["Algae","dog"])), false);

function createAcneCausingIngredientReturn(inputArray) {
    let i = 0;
    let outputArray = inputArray.map(isIngredientAcneCausing);
    let outputString = "";
    while (i < outputArray.length) {
        if (i != (outputArray.length -1)) {
            outputString = outputArray[i] ? outputString.concat(outputArray[i] + ", ") : outputString.concat("");
        } else {
            outputString = outputArray[i] ? outputString.concat(outputArray[i]) : outputString.concat("");
        }
        i++;
    }
    return outputString;
}

function updateResponseText() {
    ingredientMessage.innerHTML = createAcneCausingIngredientReturn(ingredientInputArray) + " | These ingredients are definitely not acne-safe. That being said, this kind of doesn't work right now. I mean, it doe";
}

function fillIngredientInputArray() {
    return ingredientInputArray = ingredientInput.value.split(", ");
}