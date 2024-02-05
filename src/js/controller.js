import * as model from './model.js';
import * as config from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';

import '../../node_modules/core-js/stable'
import '../../node_modules/regenerator-runtime/runtime.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if(module.hot){
  module.hot.accept();
}
const controlRecipes = async function(){
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    
    recipeView.renderSpinner();

    // Update results to mark selected search result
    resultsView.update(model.getSearcResultsPage());
    
    // Loading recipe
    await model.loadRecipe(id);
    
    // Rendering recipe
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  }catch(err){
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    if(!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearcResultsPage());

    //render pagination
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(newPage){
  //model.state.search.page = newPage;
  resultsView.render(model.getSearcResultsPage(newPage));

    //render pagination
  paginationView.render(model.state.search);
};


const controlServings = function(newServings){
  // Update the recipe sevings (in state)
  model.updateServings(newServings);
  // Update view as well
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const conrtolAddBookmark = function(){

  // 1) Add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);

};

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe){
  //console.log(newRecipe);
  try{

    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back();
    //close form
    setTimeout(function(){
      addRecipeView.toggleWindow();
    } , config.MODAL_CLOSE_SEC * 1000);

    location.reload();

  }catch(err){
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const newFeature = function(){
  console.log("Welcome to the application");
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(conrtolAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

