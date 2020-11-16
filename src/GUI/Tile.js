import ArrayData from '../utils/ArrayData';

export default class Tile {
  constructor(n) {
    this._HTML = document.createElement('div');
    this._HTML.classList.add('tile');
    this._Text = document.createElement('p');
    this._Text.classList.add('tile_text');
    this._HTML.appendChild(this._Text);
    this._number = n;
    this._isClickable = true;
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
    this.setDefaultPosition(this.getPosition());
  }

  removeFrom(parent) {
    parent.removeChild(this._HTML);
  }

  setClickable(b) {
    this._isClickable = b;
  }

  getClickable() {
    return this._isClickable;
  }

  showNumber(b) {
    this._Text.textContent = b ? this._number : '';
  }

  setPosition(x, y) {
    this._shiftX = x;
    this._shiftY = y;
    this._HTML.style.transform = `translate(${x}px, ${y}px)`;
  }

  getShift() {
    return { x: this._shiftX, y: this._shiftY };
  }

  setDefaultPosition(pos) {
    this._startX = pos.x;
    this._startY = pos.y;
  }

  getDefaultPosition() {
    return { x: this._startX, y: this._startY };
  }

  getPosition() {
    const { x } = this._HTML.getBoundingClientRect();
    const { y } = this._HTML.getBoundingClientRect();
    return { x, y };
  }

  setImage(src, size) {
    const [row, col] = ArrayData.getIndex2D(this._number - 1, size);
    this._HTML.style.background = src;
    this._HTML.style.backgroundSize = `${size * this.getWidth()}px`;
    this._HTML.style.backgroundPosition = `${-this.getWidth() * col}px ${-this.getWidth() * row}px`;
  }

  setZIndex(n) {
    this._HTML.style.zIndex = n;
  }

  getZIndex() {
    return this._HTML.style.zIndex || 0;
  }

  getNumber() {
    return this._number;
  }

  getWidth() {
    return this._HTML.getBoundingClientRect().width;
  }

  getRectPos() {
    return { x: this._HTML.getBoundingClientRect().x, y: this._HTML.getBoundingClientRect().y };
  }

  setMouseDown(func) {
    this._HTML.onmousedown = func;
  }

  updatePosition(pos, size, gap) {
    const [row, col] = ArrayData.getIndex2D(this._number - 1, size);
    const y = (pos.row - row) * (this.getWidth() + gap);
    const x = (pos.column - col) * (this.getWidth() + gap);
    this.setPosition(x, y);
  }

  disableTransition() {
    this._HTML.classList.add('disable_transition');
  }

  enableTransition() {
    this._HTML.classList.remove('disable_transition');
  }
}
