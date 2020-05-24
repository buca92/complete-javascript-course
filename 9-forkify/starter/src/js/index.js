import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/**
 * Global state of the app
 * 
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. get query from the view
    const query = searchView.getInput()

    if (query) {
        // 2. new search object and add to state
        state.search = new Search(query);

        // 3. prepare UI for results
        searchView.clearInput();
        searchView.clearResultList();
        renderLoader(elements.searchResults);

        try {
            // 4. search for recipes
            await state.search.getResults();

            // 5. render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('SOmething went wrong');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()

    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (!button) {
        return;
    }

    const goToPage = +button.dataset.goto;

    searchView.clearResultList();
    searchView.clearResultPages();
    searchView.renderResults(state.search.result, goToPage);
})

/**
 * RECIPE CONTROLLER 
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id)

    if (id) {
        // prepare UI for changes
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();

            // calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();
            state.recipe.parsingIngredients();

            // render recipe
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processing recipe!');
        }
    }
}

['hashchange', 'load'].forEach(eventName => window.addEventListener(eventName, controlRecipe));