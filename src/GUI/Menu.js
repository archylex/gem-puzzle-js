export default class Menu {
  constructor(callback) {
    this._isSound = true;
    this._isMusic = true;
    this._isRating = false;
    this._isNumbers = true;
    this._size = '4x4';
    this._calback = callback;
    this._blockScreen = document.createElement('div');
    this._blockScreen.classList.add('block_screen');
    this._HTML = document.createElement('div');
    this._HTML.classList.add('menu__window');
    this._HTML.innerHTML = `
              <p class="menu__title">MENU</p>   
              <div class="menu__line">
                <p>SIZE</p>
                <div class="dropdown">
                  <button class="dropbtn">4x4</button>
                  <div class="dropdown-content">
                    <span class="game-size">3x3</span>
                    <span class="game-size">4x4</span>
                    <span class="game-size" href="">5x5</span>
                    <span class="game-size" href="">6x6</span>
                    <span class="game-size" href="">7x7</span>
                    <span class="game-size" href="">8x8</span>
                  </div>
                </div>
              </div>
              <div class="menu__line">
                <p>SOUND</p>
                <label class="switch">
                  <input id="sound_menu" type="checkbox" checked>
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="menu__line">
                <p>MUSIC</p>
                <label class="switch">
                  <input id="music_menu" type="checkbox" checked>
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="menu__line">
                <p>NUMBERS</p>
                <label class="switch">
                  <input id="nums_menu" type="checkbox" checked>
                  <span class="slider round"></span>
                </label>
              </div>
              <button id="menu-rating" class="menu__window-button_rating">RATING TABLE</button> 
              <div class="menu__buttons">  
                <button id="menu-cancel" class="menu__window-button">CANCEL</button>
                <button id="menu-ok" class="menu__window-button">OK</button>                
              </div>`;

    this._dropdownContent = this._HTML.querySelector('.dropdown-content');
    this._numsCheckBox = this._HTML.querySelector('#nums_menu');
    this._musicCheckBox = this._HTML.querySelector('#music_menu');
    this._soundCheckBox = this._HTML.querySelector('#sound_menu');
    this._sizeButton = this._HTML.querySelector('.dropbtn');
    this.ratingList = document.querySelector('.rating__list');

    document.body.appendChild(this._blockScreen);

    this._HTML.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropbtn')) {
        this.dropdownListTogle();
      } else {
        this._isSizeButtonOn = false;
        this._dropdownContent.classList.remove('dropdown-content-active');
        if (this._isRating) this.ratingList.classList.remove('rating__list-active');
      }

      if (e.target.classList.contains('game-size')) {
        this._sizeButton.textContent = e.target.textContent;
        this._selectedSize = Number(e.target.textContent[0]);
      }

      if (e.target.id === 'menu-rating') {
        if (this.ratingList === null) this.ratingList = document.querySelector('.rating__list');
        this._isRating = !this._isRating;
        if (this._isRating) this.ratingList.classList.add('rating__list-active');
        else this.ratingList.classList.remove('rating__list-active');
      }

      if (e.target.id === 'menu-cancel') {
        this.hide();
        this._calback(0);
      }

      if (e.target.id === 'menu-ok') {
        this._size = this._sizeButton.textContent;
        this._isNumbers = this._numsCheckBox.checked;
        this._isSound = this._soundCheckBox.checked;
        this._isMusic = this._musicCheckBox.checked;
        this.hide();
        this._calback(this._selectedSize, this._isSound, this._isMusic, this._isNumbers);
      }
    });
  }

  dropdownListTogle() {
    this._isSizeButtonOn = !this._isSizeButtonOn;
    if (this._isSizeButtonOn) this._dropdownContent.classList.add('dropdown-content-active');
    else this._dropdownContent.classList.remove('dropdown-content-active');
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  show() {
    this._numsCheckBox.checked = this._isNumbers;
    this._musicCheckBox.checked = this._isMusic;
    this._soundCheckBox.checked = this._isSound;
    this._sizeButton.textContent = this._size;
    this._HTML.style.display = 'flex';
    setTimeout(() => {
      this._HTML.classList.add('menu__window-active');
      this._blockScreen.classList.add('block_screen-active');
    }, 300);
  }

  hide() {
    this._HTML.classList.remove('menu__window-active');
    this._blockScreen.classList.remove('block_screen-active');
    setTimeout(() => {
      this._HTML.style.display = 'none';
    }, 500);
  }
}
