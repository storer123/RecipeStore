import * as model from "./model.js";
import "core-js/stable"
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeViews.js";
import searchView from "./views/searchView.js";
import resultView from "./views/resultView.js";
import paginationView from "./views/paginationView.js";
import bookMarkView from "./views/bookMarkView.js";
import addRecipeView from "./views/addRecipeView.js";//unless we immort it, that page will not be considered part of deendency
// if(module.hot){
//   module.hot.accept();
// }
const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1);
    if(!id)return;//guard clause
    recipeView.renderSpinner();
    resultView.update(model.getSearchResultPage());
    //1 loading recipe
    await model.loadRecipe(id); //load state/recipe
    //rendering recipe
    recipeView.render(model.state.recipe);
    bookMarkView.update(model.state.bookmarks);
  }catch(err){
    recipeView.renderError("my personal error"+err);
    //console.log(err);
  }
}

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    // 1. Load search results
    await model.loadSearchResult(query);

    // 2. Render search results using resultView
    resultView.render(model.getSearchResultPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = async function (gotoPg) {
  resultView.render(model.getSearchResultPage(gotoPg));
    paginationView.render(model.state.search);
}

const controlServings = async function (newServing) {
  //update serving in state
  model.updateServings(newServing);
  //update veiw
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  //add/remove bookmark
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //update recipe view
  recipeView.render(model.state.recipe);
  //render bookmark
  bookMarkView.render(model.state.bookmarks);
}
const controlBookmarks=function(){
  bookMarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    //loadRecipe
    addRecipeView.renderSpinner();
  //upload new recipe
    await model.uploadRecipe(newRecipe);
    //render recipe
    //console.log(model.state.recipe);
    recipeView.render(model.state.recipe)
    //close form window
    setTimeout(function(){addRecipeView.toggleWindow()},MODAL_CLOSE_SEC*1000);
    //SUCESS MESSAGE
    addRecipeView.renderMessage();
    //renderBookmarks
    bookMarkView.render(model.state.bookmarks);
    //change id of url
    window.history.pushState(null,"",`#${model.state.recipe.id}`);
  }catch(err){
      addRecipeView.renderError(err);
      console.error(err);
  }
}
//controlRecipes(); make it subscriber as shown below
const init = function(){
  bookMarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookMark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}
init();

