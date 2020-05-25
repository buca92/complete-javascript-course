import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResultList = () => elements.searchResultList.innerHTML = '';

export const clearResultPages = () => elements.searchResultPages.innerHTML = '';

export const highlightSelected = id => {
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(element => {
        element.classList.remove('results__link--active');
    });

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
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

// type: prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, items) => {
    const pages = Math.ceil(numResults / items);

    // only one page is there
    if (pages === 1) {
        return;
    }

    let button;

    if (page === 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages) {
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, items = 10) => {
    const start = (page - 1) * items;
    const end = page * items;

    recipes.slice(start, end).forEach(renderRecipe);

    renderButtons(page, recipes.length, items);
}