"use strict";

let ingredientMessage = document.getElementById("acne-safe-response");
let processListButton = document.getElementById("annoying-button");
let ingredientInput = document.getElementById("ingredient-input");
processListButton.addEventListener("click", updateResponseText, false);

function updateResponseText() {
    ingredientMessage.innerHTML = ingredientInput.value;
}

