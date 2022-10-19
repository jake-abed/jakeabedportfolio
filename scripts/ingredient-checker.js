"use strict";
/*
For now I've set up an array containing a string for each "Acne Causing Ingredient".
This is clunky. One ingredient (or family of ingredients) could have variations, alternate spellings,
different names, or even extremely common mispellings. Even with a fuzzylogic module
for spelling matches, I believe this to be the incorrect approach.

I'm leaning toward a map right now. But I need to do more research. Maybe classes with individual object for Acne-Causing Ingredient (ingredient combo?)

To-Do
-Choose data structure to store final ingredient dictionary in.
-Research modules and how to effectively use them in practice. Maybe tutorial on YouTube?
-Determine how I want final output to look?
    *Baseline: Tell the user either "Yes, This Is Safe!" or "No, This Could Cause Acne!"
    *Extra: "The following ingredients can cause acne:"
    *Even more extra: For each ingredient explain what it is, how comodedogenic research has shown it to be, and why the lab may have used it in formulation?

I've got problems, lol.

Extra To-Do: ASCII Art?
*/
const ingredientDictionary = ["Acetylated Lanolin", "Acetylated Lanolin Alcohol", "Ahnfeltia Concinna Extract", "Algae", "Algae Extract", "Algin", "Almond Oil", "Argan Oil", "Argania Spinosa (Argan) Oil", "Argania Spinosa Oil", "Ascophyllum Nodosum", "Avocado Butter", "Avocado Oil", "Persea Gratissima (Avocado) Butter", "Persea Gratissima (Avocado) Oil", "Butyl Stearate", "Carrageenan", "Cetyl Acetate", "Cetearyl Alcohol + Ceteareth 20", "Chondrus Crispus", "Irish Moss", "Carageenan Moss", "Chlorella", "Coal Tar", "Cocoa Butter", "Coconut Alkanes", "Coconut Butter", "Coconut Oil", "Colloidal Sulfur", "Corn Oil", "Cotton Awws Oil", "Cotton Seed Oil", "D & C Red # 17", "D & C Red # 21", "D & C Red # 3", "D & C Red # 30", "D & C Red 36", "Decyl Oleate", "Dioctyl Succinate", "Disodim Monooleamido PEG 2-Sulfosuccinate", "Ethoxylated Lanolin", "Ethylhexyl Palmitate", "Glyceryl Stearate SE", "Glyceryl-3 Diisostearate", "Hexadecyl Alcohol", "Hydrogenated Vegetable Oil", "Hydrogenated", "Isocetyl Alcohol", "Isocetyl Stearate", "Isodecyl Oleate", "Isopropyl Isostearate", "Isopropyl Linolate", "Isopropyl Myristate", "Isopropyl Palmitate", "Isostearyl Isostearate", "Isotearyl Neopentanoate", "Kelp", "Laminaria Digitata Extract", "Laminaria Saccharina Extract", "Laminaria Saccharine", "Laureth-23", "Laureth-4", "Lauric Acid", "Lauroyl Lysine", "Mink Oil", "Myristic Acid", "Myristyl Lactate", "Myristyl Myristate", "Octyl Palmitate", "Octyl Stearate", "Oleth-3", "Oleyl Alcohol", "PEG 16 Lanolin", "PEG 200 Dilaurate", "PEG 8 Stearate", "PG Monostearate", "Phormidium Persicinum Extract", "PPG 2 Myristyl Propionate", "Plankton", "Polyglyceryl-3 Diisostearate", "Potassium Chloride", "Propylene Glycol Monostearate", "Red Algae", "Seaweed", "Sesamum Indicum (Sesame) Seed Oil", "Shark Liver Oil", "Squalene", "Shea Butter", "Butyrospermum Parkii (Shea) Butter", "Sodium Laureth Sulfate", "Sodium Lauryl Sulfate", "Solulan 16", "Sorbitan Oleate", "Soybean Oil", "Spirulina", "Steareth 10", "Stearic Acid Tea", "Stearyl Heptanoate", "Sulfated Castor Oil", "Sulfate Jojoba Oil", "Sweet Almond Oil", "Wheat Germ Glyceride", "Wheat Germ Oil", "Triticum Vulgare (Wheat) Germ Oil", "Xylene"];

const ingredientMessage = document.getElementById("acne-safe-response"); //The H2 in the document that changes depending on response. Right now, this name is too vague.
const processListButton = document.getElementById("annoying-button"); //The "submission" button that runs the script. Change this name, too jokey, not intelligible.
const ingredientInput = document.getElementById("ingredient-input"); // The textarea in the doc containing the user input.
let ingredientInputArray = []; //Blank array to store formatted user input. May not be best practice.
let isIngredientAcneCausing = (ingredient) => ingredientDictionary.includes(ingredient) ? ingredient + " " : false; // Check if the dictionary contains the ingredient.

processListButton.addEventListener("click", fillIngredientInputArray, false); //Event listener on button that updates the ingredient input array.
processListButton.addEventListener("click", updateResponseText, false); // Event listener on button that updates the H2 with the answer.
processListButton.addEventListener("click", console.log(createAcneCausingIngredientReturn(["Algae","dog"])), false); // Test console log to make sure function works. Bloat.

function fillIngredientInputArray() {
    return ingredientInputArray = ingredientInput.value.split(", ");
}
/*
The star of the show is below, although I will probably change it significantly in refactoring. Here's why:
    -Right now it just returns a "String" - but what if I want to change multiple things? How do I handle that? Return an object, an array, what? Not seriously asking, just posing questions.
    -If it starts to do more, maybe it should be more than one function. One function, one purpose.
So yeah, I need to do some "soul-searching" on what I really want it to return for now. Fortunately, that isn't crazy difficult to change.
*/

function createAcneCausingIngredientReturn(inputArray) {
    let i = 0; //Establish i for while loop.
    let outputArray = inputArray.map(isIngredientAcneCausing); //Use map method to make a new array - If it is acne-causing, it goes in, if not it's position gets replaced by false boolean value.
    let outputString = ""; //Create empty output string.
    while (i < outputArray.length) { //Finish the loop when i = the length of the output array.
        if (i != (outputArray.length -1)) { //If not the final entry...
            outputString = outputArray[i] ? outputString.concat(outputArray[i] + ", ") : outputString.concat(""); //Add a comma!
        } else {
            outputString = outputArray[i] ? outputString.concat(outputArray[i]) : outputString.concat(""); //Else no comma!
        }
        i++; //Increment i up.
    }
    return outputString;
}

/*
The following functions interacts with the DOM.
*/

function updateResponseText() {
    ingredientMessage.innerHTML = createAcneCausingIngredientReturn(ingredientInputArray) ? "Dang! It's not acne-safe! | The following ingredients are to blame: " + createAcneCausingIngredientReturn(ingredientInputArray) + "." : "Seems safe!";
}