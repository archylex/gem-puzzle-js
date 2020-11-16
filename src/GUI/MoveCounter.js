export default class MoveCounter {
  constructor() {
    this._HTML = document.createElement('div');
    this._HTML.classList.add('move__counter');
    this._HTML.innerHTML = `<p class="move__counter-sup">moves</p>
                                <div class="flip-steps">
                                  <span class="flip-steps__piece">
                                    <b class="flip-steps__card card">
                                      <b class="card__top"></b>
                                      <b class="card__bottom"></b>
                                      <b class="card__back">
                                        <b class="card__bottom"></b>
                                      </b>
                                    </b>
                                  </span>
                                </div>`;

    this._flip = this._HTML.querySelector('.flip-steps__piece');
    this._topCard = this._HTML.querySelector('.card__top');
    this._bottomCard = this._HTML.querySelector('.card__bottom');
    this._backCard = this._HTML.querySelector('.card__back');
    this._backBottomCard = this._HTML.querySelector('.card__back .card__bottom');

    this._moves = 0;
    this.setText(this._moves);
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  addMove() {
    this._moves += 1;
    this.setText(this._moves);
  }

  setMoves(n) {
    this._moves = n;
    this.setText(n);
  }

  reset() {
    this._moves = 0;
    this.setText(this._moves);
  }

  getMoves() {
    return this._moves;
  }

  setText(value) {
    if (value !== this._currentValue) {
      if (this._currentValue >= 0) {
        this._backCard.setAttribute('data-value', this._currentValue);
        this._bottomCard.setAttribute('data-value', this._currentValue);
      }

      this._currentValue = value;
      this._topCard.innerText = this._currentValue;
      this._backBottomCard.setAttribute('data-value', this._currentValue);

      this._flip.classList.remove('flip');
      const getOffset = () => this._flip.offsetWidth;
      getOffset();

      this._flip.classList.add('flip');
    }
  }
}
