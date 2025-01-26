import { API_URL, RES_PER_PAGE, API_KEY } from "./config";
import { AJAX } from "./helper";
export { state, loadRecipe };
const state = {
    recipe: {},
    search:{
        query : "",
        results: [],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function(data){
    const {recipe} = data.data;
    return {
        id: recipe.id,
            title: recipe.title,
            publisher:recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            ...(recipe.key && {key: recipe.key}),//remember-> conditionally add properties to object == key: recipe.key,
    }
}

const loadRecipe = async function (id) {
    try{
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);
        //console.log(state.recipe);
        if(state.bookmarks.some(bookmark=>bookmark.id===id))
            state.recipe.bookmarked=true;
        else
            state.recipe.bookmarked=false;
    }catch(err){
        //console.log(err);
        throw(err);
    }
};
export const loadSearchResult= async function(query){
    try{
        state.search.query=query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher:rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key}),
            };
        });state.search.page=1;
    }catch(err){
        throw(err);
    }
}


export const getSearchResultPage = function(page = state.search.page){
    state.search.page = page;
    const start =(page-1) * state.search.resultsPerPage //0;
    const end =page * state.search.resultsPerPage; //10;
    return state.search.results.slice(start, end);
}

export const updateServings = async function(newServing){
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServing )/state.recipe.servings ;
    });
    state.recipe.servings = newServing;
}

const persistBookmarks = function(){
    localStorage.setItem("bookmarks",JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    state.bookmarks.push(recipe);
    if(recipe.id===state.recipe.id)state.recipe.bookmarked=true;
    persistBookmarks();
}
export const deleteBookmark = function(id){
    const index = state.bookmarks.findIndex(el=>el.id===id);
    state.bookmarks.splice(index,1);
    if(id===state.recipe.id)state.recipe.bookmarked=false;
    persistBookmarks();
}
const init = function(){
    const storage = localStorage.getItem("bookmarks");
    if(storage) state.bookmarks=JSON.parse(storage);
    console.log(state.bookmarks);
};

const clearBookMarks = function(){
    localStorage.clear("bookmarks");
};
//init();
clearBookMarks();//toggle above and this to get the result
export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe)
        .filter(entry=> (entry[0].slice(0,10)==="ingredient" && entry[1]))
        .map(ing => {
            const ingArr= ing[1].split(",").map(el=> el.trim());
            if(ingArr.length!==3)throw new Error("Wrong format of ingredient");
            const [quantity, unit, description] = ingArr;
            return {quantity:quantity? +quantity:null, unit, description};
        });
    
        const recipe = {
            id: newRecipe.id,
            title: newRecipe.title,
            publisher:newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients: ingredients,
        };
        const data = await AJAX(`${API_URL}?key=${API_KEY}`,recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    }
    catch(err){
        throw err;
    }
    
}