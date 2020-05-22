import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResultList = () => elements.searchResultList.innerHTML = '';

const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        title = `${title.substr(0, limit)}...`;
    }

    return title;
};

const renderRecipe = ({ recipe_id: recipeId, image_url: imageUrl, title, publisher }) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipeId}">
                <figure class="results__fig">
                    <img src="${imageUrl}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(title)}</h4>
                    <p class="results__author">${publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
}