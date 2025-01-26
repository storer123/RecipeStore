import icons from "url:../../img/icons.svg" ;
import View from "./view";
class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler){//event delegation
        this._parentElement.addEventListener("click",function(e){
            const btn = e.target.closest(".btn--inline");
            if(!btn)return;
            console.log(btn);
            const gotoPg = btn.dataset.fetchPage;
            handler(Number(gotoPg));
        })
    }
    _generateMarkup(){
        //console.log(this._data.results , this._data.resultsPerPage);
        const numPages = Math.ceil(this._data.results.length/this._data.resultsPerPage);
        const currPage = this._data.page;
        console.log(numPages);
        //page1 and other pages
        if(currPage === 1 && numPages>1){
            return `
            <button data-fetch-page="${currPage+1}" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${currPage+1}</span>
            </button>
            `
        }
        //last page
        if(currPage === numPages && numPages>1){
            return `
            <button data-fetch-page="${currPage-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage-1}</span>
            </button>
            `
        }
        //middle page
        if(currPage<numPages){
            return `
            <button data-fetch-page="${currPage-1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage-1}</span>
            </button>
            <button data-fetch-page="${currPage+1}" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>Page ${currPage+1}</span>
            </button>
            `
        }
        //page 1 and no other pages
        return "";
    }
}

export default new PaginationView();