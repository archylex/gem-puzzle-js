import GameAPI from '../utils/GameAPI';
import Utils from '../utils/Utils';

export default class RatingTable {
  constructor(size) {
    this._size = size;
    this._name = '';
    this._time = 0;
    this._moves = 0;
    this._isByTime = true;
    this._HTML = document.createElement('div');
    this._HTML.classList.add('rating__list');
    this._Button = document.createElement('button');
    this._Button.classList.add('rating__list-button');
    this._Button.textContent = 'time rating';
    this._List = document.createElement('div');
    this._List.classList.add('rating__list-list');
    this._HTML.appendChild(this._Button);
    this._HTML.appendChild(this._List);

    this._Button.addEventListener('click', () => {
      this._isByTime = !this._isByTime;
      this._Button.textContent = this._isByTime ? 'time rating' : 'moves rating';
      this.loadRating();
    });

    this.loadRating();
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  isBestTime(time) {
    const mr = this._movesRating;
    return !!(mr.filter((e) => e.time > time).length > 0 || mr.length < 10);
  }

  isBestMoves(moves) {
    const mr = this._movesRating;
    return !!(mr.filter((e) => e.steps > moves).length > 0 || mr.length < 10);
  }

  setSize(size) {
    this._size = size;
  }

  loadRating() {
    const size = `${this._size}x${this._size}`;
    GameAPI.loadRating(size, this.setRatingTables.bind(this));
  }

  setRatingTables(timeRating, movesRating) {
    this._timeRating = timeRating;
    this._movesRating = movesRating;

    const data = this._isByTime ? this._timeRating : this._movesRating;
    this.updateTable(data);
  }

  updateTable(ratingData) {
    this._List.innerHTML = '<div class="rating_list_item rating_item_header">Name</div>';
    this._List.innerHTML += '<div class="rating_list_item rating_item_header">Size</div>';
    this._List.innerHTML += '<div class="rating_list_item rating_item_header">Moves</div>';
    this._List.innerHTML += '<div class="rating_list_item rating_item_header">Time</div>';
    this._List.innerHTML += '<div class="rating_list_item rating_item_header">Date</div>';

    const length = ratingData.length > 10 ? 10 : ratingData.length;

    for (let k = 0; k < length; k++) {
      const date = new Date(ratingData[k].date);
      const dateStr = `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`;
      const t = Utils.getTimeFormatStr(ratingData[k].time);
      this._List.innerHTML += `<div class="rating_list_item">${ratingData[k].name}</div>`;
      this._List.innerHTML += `<div class="rating_list_item">${ratingData[k].size}</div>`;
      this._List.innerHTML += `<div class="rating_list_item">${ratingData[k].steps}</div>`;
      this._List.innerHTML += `<div class="rating_list_item">${t}</div>`;
      this._List.innerHTML += `<div class="rating_list_item">${dateStr}</div>`;
    }
  }
}
