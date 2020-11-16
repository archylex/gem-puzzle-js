export default class DialogBox {
  constructor() {
    this._HTML = document.createElement('div');
    this._HTML.classList.add('modal__window');

    this._Text = document.createElement('p');
    this._Text.classList.add('modal__window-text');

    this._Input = document.createElement('input');
    this._Input.classList.add('modal__window-input');

    this._Button = document.createElement('button');
    this._Button.classList.add('modal__window-button');
    this._Button.textContent = 'OK';

    this._Button.addEventListener('click', () => {
      if (this._Input.value !== '') {
        this.hide();
        this.setHasInput(false);
        this._callback(this._Input.value);
        this._Input.value = '';
      } else this.hide();
    });

    this._HTML.appendChild(this._Text);
  }

  appendTo(parent) {
    parent.appendChild(this._HTML);
  }

  setWidth(width) {
    this._width = width;
    this._HTML.style.width = `${width}%`;
    this.centering();
  }

  setHeight(height) {
    this._height = height;
    this._HTML.style.height = `${height}%`;
    this.centering();
  }

  setText(text) {
    this._Text.innerHTML = text;
  }

  setHasButton(b) {
    const btn = document.querySelector('.modal__window-button');

    if (b && btn === null) this._HTML.appendChild(this._Button);
    if (!b && btn !== null) this._HTML.removeChild(this._Button);
  }

  setHasInput(b) {
    const input = document.querySelector('.modal__window-input');

    if (b && input === null) this._HTML.appendChild(this._Input);
    if (!b && input !== null) this._HTML.removeChild(this._Input);
  }

  setCancelable(b) {
    if (b) {
      const btnBar = document.createElement('div');
      btnBar.classList.add('dialog_box_buttons_bar');
      const okBtn = document.createElement('button');
      okBtn.classList.add('menu__window-button');
      okBtn.textContent = 'YES';
      const cancelBtn = document.createElement('button');
      cancelBtn.classList.add('menu__window-button');
      cancelBtn.textContent = 'NO';
      btnBar.append(cancelBtn, okBtn);
      this._HTML.appendChild(btnBar);
      okBtn.addEventListener('click', () => {
        this.setCancelable(false);
        this.hide();
        this._callback(true);
      });
      cancelBtn.addEventListener('click', () => {
        this.setCancelable(false);
        this.hide();
        this._callback(false);
      });
    } else {
      const child = this._HTML.querySelector('.dialog_box_buttons_bar');
      this._HTML.removeChild(child);
    }
  }

  setCallback(func) {
    this._callback = func;
  }

  show() {
    this._HTML.style.visibility = 'visible';
    setTimeout(() => {
      this._HTML.classList.add('modal__window-active');
    }, 300);
  }

  hide() {
    this._HTML.classList.remove('modal__window-active');
    setTimeout(() => {
      this._HTML.style.visibility = 'hidden';
    }, 500);
  }

  centering() {
    this._HTML.style.transform = 'translate(-50%, -50%)';
  }
}
