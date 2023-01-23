const DOM = {
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
    addMainLoader();
    let cocktail = await searchCocktail(API.random);
    let ingredients = getIngredients(cocktail);
    setTimeout(() => {
        removeMainLoader();
    }, 1000);
    generateCocktailSection();
    generateIngredientSection(ingredients);
    showCocktail(cocktail,ingredients);
    setTimeout(() => {
        removeLoaders();
        showCards();
    }, 2000);
}
function addMainLoader(){
    DOM.randomButton.disabled = true;
    document.getElementById("mainLoader").classList.add("mainLoader");
    document.getElementById("content").classList.add("d-none");
}
function removeMainLoader(){
    document.getElementById("mainLoader").classList.remove("mainLoader");
    document.getElementById("content").classList.remove("d-none");
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
    .then(cocktail => {foundCocktail = cocktail})
    .catch(response => {
        foundCocktail.strDrinkThumb = "./img/Image_not_available.png";
        foundCocktail.strInstructions = "No se ha podido conseguir un cóctel";
        foundCocktail.strDrink = "No encontrado";
    });
    return foundCocktail;
    
}
function generateCocktailSection(){
    clearCocktail();
    let card = document.createElement("div");
    let loader = document.createElement("span");
    let cardBody = document.createElement("div");
    let cocktailName = document.createElement("h5");
    let cocktailImg = document.createElement("img");
    let cocktailInstructions = document.createElement("p");

    card.id = "cocktailCard";
    cocktailName.id = "cocktailName";
    cocktailImg.id = "cocktailImg";
    cocktailInstructions.id = "cocktailInstructions";
    loader.id = "cocktailLoader";
    card.classList.add("card","mt-5","d-none");
    loader.classList.add("loader");
    cocktailImg.classList.add("card-img");
    cardBody.classList.add("card-body","p-0","px-3","pt-2");
    cocktailName.classList.add("card-title","bg-light","text-center");
    cocktailInstructions.classList.add("card-text","pb-2");

    DOM.cocktailSection.insertAdjacentElement("beforeend",loader);
    DOM.cocktailSection.insertAdjacentElement("beforeend",card);
    card.insertAdjacentElement("beforeend",cocktailImg);
    card.insertAdjacentElement("beforeend",cardBody);
    cardBody.insertAdjacentElement("beforeend",cocktailName);
    cardBody.insertAdjacentElement("beforeend",cocktailInstructions);

}
function removeLoaders(){
    let loaders = Array.prototype.slice.call(document.getElementsByClassName("loader"));
    loaders.forEach(e => e.classList.add("d-none"));
}
function showCards(){
    let cards = Array.prototype.slice.call(document.getElementsByClassName("card"));
    cards.forEach(e => e.classList.remove("d-none"));
    DOM.randomButton.disabled = false;
}
async function generateIngredientSection(ingredients){
    DOM.ingredientsLabel.textContent = "Ingredientes";
    ingredients.forEach(ingredient => {
        let loader = document.createElement("div");
        let card = document.createElement("div");
        let cardBody = document.createElement("div");
        let ingredientName = document.createElement("h5");
        let ingredientImg = document.createElement("img");

        DOM.ingredientsSection.insertAdjacentElement("beforeend",loader);
        DOM.ingredientsSection.insertAdjacentElement("beforeend",card);
        card.insertAdjacentElement("beforeend",ingredientImg); 
        card.insertAdjacentElement("beforeend",cardBody);
        cardBody.insertAdjacentElement("beforeend",ingredientName);

        loader.classList.add("loader","m-2");
        card.classList.add("card","m-2","d-none"); 
        card.style = "min-width: 8rem; max-width:12rem;";
        
        ingredientName.classList.add("card-title");
        ingredientName.textContent = ingredient;

        ingredientImg.classList.add("card-img-top","ingredientImg");
        cardBody.classList.add("card-body");
    });
}
function loadCocktail(cocktail){
    document.getElementById("cocktailName").textContent = cocktail.strDrink;
    document.getElementById("cocktailInstructions").textContent = cocktail.strInstructions;
    document.getElementById("cocktailImg").src = cocktail.strDrinkThumb;
}
function showCocktail(cocktail,ingredients) {
        loadCocktail(cocktail);
        loadIngredients(ingredients);
}
async function loadIngredients(ingredients){
    let promises = []
    ingredients.forEach(ingredient => {
        promises.push(fetch("https://www.thecocktaildb.com/images/ingredients/"+ ingredient + "-Small.png")
        .then(response => response.blob()))
    });
    let images = Array.prototype.slice.call(document.getElementsByClassName("ingredientImg"));
    let index = 0;
    Promise.all(promises)
    .then(response => {
        images.forEach(e => {
            e.src = URL.createObjectURL(response[index++]);
        });
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
    while(DOM.ingredientsSection.firstChild)
        DOM.ingredientsSection.removeChild(DOM.ingredientsSection.lastChild);
}