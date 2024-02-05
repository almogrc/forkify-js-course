import icons from 'url:../../img/icons.svg';
export default class View{

    _data;
    /**
     *  Render the recived object to the dom
     * @param {Object | Object[]} data The data to be rendered (e.g recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Almog Raccah 
     */
    render(data, render = true){
        if(!data || (Array.isArray(data) && data.length ===0)){
            this.renderError();
            return;
        }
        this._data = data;
        const markUp = this._generateMarkup();
        if(!render) return markUp;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markUp);
    }
    _clear() {
        this._parentElement.innerHTML = '';
    }

    update(data){
      
      this._data = data;
      const newMarkUp = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkUp);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const currElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl,i) =>{
        if(!newEl.isEqualNode(currElements[i]) &&
         newEl.firstChild?.nodeValue.trim()!==''){
          currElements[i].textContent = newEl.textContent;
        }
        if(!newEl.isEqualNode(currElements[i])){
          Array.from(newEl.attributes).forEach(attr =>currElements[i].setAttribute(attr.name,attr.value));
        }
      });

    }

    renderSpinner(){
        const markUp= `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    };

    renderError(message = this._errorMessage){
      const markUp= `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    };

    renderMessage(message = this._message){
      const markUp= `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
      `;
      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    };
};