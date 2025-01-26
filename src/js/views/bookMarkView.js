import View from "./view";
import previewView from "./previewView";
import icons from "url:../../img/icons.svg" ;
class BookMarkView extends View{
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = "no bookmark yet!"
    addHandlerRender(handler){
        window.addEventListener("load",handler);
    }
    _generateMarkup(){
        return this._data.map(BookMark=>previewView.render(BookMark,false)).join("");
    }
    
}
export default new BookMarkView();