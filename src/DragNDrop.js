export default class DragNDrop {
  constructor(element, func) {
    this._element = element;
    this._startPos = {};
    this._startShift = {};
    this._element.setMouseDown(DragNDrop.mouseDown.bind(this));
    this._callback = func;
  }

  static mouseDown(e) {
    e.preventDefault();

    if (this._element.getClickable()) {
      this._isDrag = false;
      this._startZ = this._element.getZIndex();
      this._element.setZIndex(5000);
      this._startPos.x = e.clientX;
      this._startPos.y = e.clientY;
      this._startShift.x = this._element.getShift().x;
      this._startShift.y = this._element.getShift().y;
      this._element.disableTransition();

      document.onmouseup = DragNDrop.mouseUp.bind(this);
      document.onmousemove = DragNDrop.mouseMove.bind(this);
    }
  }

  static mouseMove(e) {
    e.preventDefault();

    if (this._element.getClickable()) {
      this._isDrag = true;

      const x = e.clientX - this._startPos.x + this._startShift.x;
      const y = e.clientY - this._startPos.y + this._startShift.y;

      this._element.setPosition(x, y);
    }
  }

  static mouseUp() {
    if (this._element.getClickable()) {
      this._element.setZIndex(this._startZ);
      this._element.enableTransition();
      document.onmouseup = null;
      document.onmousemove = null;
      this._callback(this._element, this._isDrag);
    }
  }
}
