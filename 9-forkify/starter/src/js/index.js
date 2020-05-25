import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

// TODO: TESTING
window.state = state;

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert('Error processing recipe!');
        }
    }
}

['hashchange', 'load'].forEach(eventName => window.addEventListener(eventName, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // create new list if there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(elem => {
        const item = state.list.addItem(elem.count, elem.unit, elem.ingredient);
        listView.renderItem(item);
    });
}

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    
    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentId)) {
        // add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);

        // toggle the like button
        likesView.toggleLikeButton(true);

        // add to the UI list
        likesView.renderLike(newLike);
    } else {
        // remove like from the state
        state.likes.deleteLike(currentId);

        // toggle the like button
        likesView.toggleLikeButton(false);

        // remove from the UI list
        likesView.deleteLike(currentId);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Handle delete and update list items events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const value = +e.target.value;
        state.list.updateCount(id, value);
    }
});

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // restore likes
    state.likes.readStorage();

    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // either .btn-decrease or any child (*) of .btn-decrease
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // either .btn-increase or any child (*) of .btn-increase
        // increase button is clicked
        state.recipe.updateServings('inc');
    } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) { // either .recipe__btn-add or any child (*) of .recipe__btn-add
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) { // either .recipe__love or any child (*) of .recipe__love
        // like controller
        controlLike();
    }

    recipeView.updateServingsIngredients(state.recipe);
})