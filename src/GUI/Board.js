export default class Board {
  constructor() {
    this._HTML = document.createElement('div');
    this._HTML.classList.add('board');
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  removeChild(child) {
    this._HTML.removeChild(child);
  }

  appendChild(child) {
    if (/^HTML\w+Element$/.test(child.constructor.name)) this._HTML.appendChild(child);
    else child.appendTo(this._HTML);
  }

  setGrid(size) {
    this._HTML.style.gridTemplateColumns = 'auto '.repeat(size);
    this._HTML.style.gridTemplateRows = 'auto '.repeat(size);
  }

  getSize() {
    return this._HTML.getBoundingClientRect().width;
  }

  getPosition() {
    const { x } = this._HTML.getBoundingClientRect();
    const { y } = this._HTML.getBoundingClientRect();
    return { x, y };
  }
}
