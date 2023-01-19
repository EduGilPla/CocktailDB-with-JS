const DOM = {
    // numberInput: document.getElementById("inputBoton"),
    // searchButton: document.getElementById("searchCoctel"),
    randomButton: document.getElementById("randomCoctel"),    
    ingredientsSection: document.getElementById("ingredientsSection"),
    ingredientsLabel: document.getElementById("ingredientsLabel"),
    cocktailSection: document.getElementById("cocktailSection")
};
const API = {
    random: 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
};

(function(){
    DOM.randomButton.addEventListener("click",showRandom);
})();

async function showRandom(){
    let cocktail = await searchCocktail(API.random);
    clearCocktail();
    showCocktail(cocktail);
}
async function searchCocktail(url){
    let foundCocktail;
    await fetch(url)
    .then(response => {
        if (!response.ok)
            throw new Error("HTTP error" + response.status);
        return response.json();
    })
    .then(json => {
        return json.drinks[0];
    })
    .then(cocktail => {foundCocktail = cocktail});
    return foundCocktail;
}
function generateCocktailSection(cocktail){
    let card = document.createElement("div");
    let cardBody = document.createElement("div");
    let cocktailName = document.createElement("h5");
    let cocktailImg = document.createElement("img");
    let cocktailInstructions = document.createElement("p");

    card.classList.add("card","mt-5");
    cocktailImg.classList.add("card-img");
    cardBody.classList.add("card-body","p-0","px-3","pt-2");
    cocktailName.classList.add("card-title","bg-light","text-center");
    cocktailInstructions.classList.add("card-text","pb-2");

    DOM.cocktailSection.insertAdjacentElement("beforeend",card);
    card.insertAdjacentElement("beforeend",cocktailImg);
    card.insertAdjacentElement("beforeend",cardBody);
    cardBody.insertAdjacentElement("beforeend",cocktailName);
    cardBody.insertAdjacentElement("beforeend",cocktailInstructions);

    cocktailName.textContent = cocktail.strDrink;
    cocktailInstructions.textContent = cocktail.strInstructions;
    cocktailImg.src = cocktail.strDrinkThumb;
}
async function showCocktail(cocktail) {
        generateCocktailSection(cocktail);
        
        ingredientsArray = getIngredients(cocktail);

        DOM.ingredientsLabel.textContent = "Ingredientes";
        ingredientsArray.forEach(ingredient => {
            let card = document.createElement("div");
            let cardBody = document.createElement("div");
            let ingredientName = document.createElement("h5");
            let ingredientImg = document.createElement("img");

            DOM.ingredientsSection.insertAdjacentElement("beforeend",card);
            card.insertAdjacentElement("beforeend",ingredientImg); 
            card.insertAdjacentElement("beforeend",cardBody);
            cardBody.insertAdjacentElement("beforeend",ingredientName);

            card.classList.add("card","m-2"); 
            card.style = "min-width: 8rem; max-width:12rem;";
            
            ingredientName.classList.add("card-title");
            ingredientName.textContent = ingredient;

            ingredientImg.classList.add("card-img-top");
            fetch("https://www.thecocktaildb.com/images/ingredients/" + ingredient + ".png")
                .then(response => response.blob())
                .then(blob => ingredientImg.src = URL.createObjectURL(blob))
            cardBody.classList.add("card-body");
        }); 
}
function getIngredients(cocktail){
    return Object.entries(cocktail)
    .filter(([key,value]) => key.startsWith("strIngredient") && value && value.trim())
    .map(([key,value]) => value);
}
function clearCocktail(){
    while(DOM.cocktailSection.firstChild)
        DOM.cocktailSection.removeChild(DOM.cocktailSection.lastChild);
    while(DOM.ingredientsSection.firstChild){
        DOM.ingredientsSection.removeChild(DOM.ingredientsSection.lastChild);
    }
}