import './styles.sass';

import RatingTable from './RatingTable';
import DialogBox from './DialogBox';
import Timer from './Timer';
import MoveCounter from './MoveCounter';
import Menu from './Menu';
import Board from './Board';
import Tile from './Tile';
import DragNDrop from '../DragNDrop';
import GemPuzzle from '../GemPuzzle';
import Solver from '../Solver';
import GameAPI from '../utils/GameAPI';
import Utils from '../utils/Utils';
import ArrayData from '../utils/ArrayData';
import Errors from '../utils/Errors';

export default class GUI {
  constructor(size) {
    this._size = size;
    this._tiles = [];
    const numImg = ~~(Math.random() * 5) + 1;
    this._srcImg = `url('../assets/card-${numImg}.jpg')`;
    this._moveSound = new Audio('../assets/move.wav');
    this._music = new Audio('../assets/music.ogg');
    this._music.loop = true;
    this._isSound = true;
    this._isMusic = true;
    this._isNumbers = true;
    this._isWon = true;

    this._container = document.createElement('div');
    this._container.classList.add('container');

    this._board = new Board();
    this._board.setGrid(size);

    this._dialogBox = new DialogBox();

    this._info = document.createElement('div');
    this._info.classList.add('info__block');

    this._timer = new Timer();
    this._timer.appendTo(this._info);

    this._moveCounter = new MoveCounter();
    this._moveCounter.appendTo(this._info);

    this._ratingTable = new RatingTable(size);
    this._ratingTable.appendTo(this._info);

    this._menu = new Menu(this.setParams.bind(this));
    this._menu.appendTo(document.body);

    this._controlPanel = document.createElement('div');
    this._controlPanel.classList.add('control__panel');

    this._startButton = document.createElement('button');
    this._startButton.classList.add('start__button');
    this._startButton.textContent = 'start';

    this._menuButton = document.createElement('button');
    this._menuButton.classList.add('menu__button');
    this._menuButton.textContent = 'M';

    this._solveButton = document.createElement('button');
    this._solveButton.classList.add('solve__button');
    this._solveButton.textContent = 'solve';

    this._board.appendTo(this._container);
    this._container.appendChild(this._info);

    this._controlPanel.appendChild(this._startButton);
    this._controlPanel.appendChild(this._menuButton);
    this._controlPanel.appendChild(this._solveButton);

    this._dialogBox.appendTo(document.body);
    this._info.appendChild(this._controlPanel);

    this.addListeners();
    this.disableSolveButton(true);
  }

  addListeners() {
    this._startButton.addEventListener('click', () => {
      this.removeSavedGame();
      this._gemPuzzle.startGame();
      this._tiles2d = this._gemPuzzle.getTiles2d();
      this.updateTilesPosition();
      this._moveCounter.reset();
      this._timer.startTimer();
      this._isWon = false;      
      if (this._isMusic) this._music.play();
      if (this._size === 4) this.disableSolveButton(false);
    });

    this._menuButton.addEventListener('click', () => {
      this._timer.stopTimer();
      this._menu.show();
    });

    this._solveButton.addEventListener('click', () => {
      this._timer.stopTimer();
      this.disableSolveButton(true);
      this.disableStartButton(true);
      this._dialogBox.setWidth(20);
      this._dialogBox.setHeight(10);
      this._dialogBox.setText('Solving puzzle...');
      this._dialogBox.setHasButton(false);
      this._dialogBox.setHasInput(false);
      this._dialogBox.show();
      this._tiles.forEach((tile) => tile.setClickable(false));
      this._isWon = true;
      this.removeSavedGame();

      setTimeout(this.solveGame.bind(this), 1000);
    });
  }

  createTiles() {
    for (let i = 0; i < this._size * this._size - 1; i++) {
      const tile = new Tile(i + 1);
      tile.appendTo(this._board);
      tile.setImage(this._srcImg, this._size);
      tile.showNumber(this._isNumbers);
      new DragNDrop(tile, this.checkTilePosition.bind(this));
      this._tiles.push(tile);
      tile.setPosition(0, 0);
    }
  }

  checkTilePosition(tile, isDrag) {
    if (!this._isWon && ((isDrag && this.intersect(tile)) || !isDrag)) {
      if (this._gemPuzzle.getMove(tile.getNumber())) {
        if (this._isSound) this._moveSound.play();
        this._tiles2d = this._gemPuzzle.getTiles2d();
        this._moveCounter.addMove();
        if (this._gemPuzzle.isSolved()) {
          this._isWon = true;
          this.showWonWindow();
        }
      }
    }

    if (this._isWon) { this.removeSavedGame(); } else this.saveGame();

    this.updateTilePos(tile.getNumber());
  }

  updateTilesPosition() {
    for (let i = 0; i < this._tiles.length; i++) this.updateTilePos(i + 1);
  }

  updateTilePos(n) {
    const mPos = this._tiles2d[n];
    const gap = this._board.getSize() / 100;
    this._tiles[n - 1].updatePosition(mPos, this._size, gap);
  }

  updateTilesSize() {
    for (let i = 0; i < this._tiles.length; i++) {
      this._tiles[i].disableTransition();
      this._tiles[i].setImage(this._srcImg, this._size);
      this.updateTilesPosition();
      this._tiles[i].enableTransition();
    }
  }

  appendTo(parent) {
    parent.appendChild(this._container);
  }

  showWonWindow() {
    const time = this._timer.getTime();
    this._timer.stopTimer();
    const moves = this._moveCounter.getMoves();
    const tf = Utils.getTimeFormat(time);
    let text = `<h2>Win!</h2><p>The puzzle was solved in</p><p><strong>${tf.hrs} hrs ${tf.mins} mins ${tf.secs} secs</strong></p><p>and</p><p><strong>${moves} moves</strong></p><br>`;

    let top10 = false;

    if (this._ratingTable.isBestTime(time)) {
      text += '<p>You\'re in the top ten by time!</p>';
      top10 = true;
    }

    if (this._ratingTable.isBestMoves(moves)) {
      text += '<p>You\'re in the top ten by moves!</p>';
      top10 = true;
    }

    this._dialogBox.setWidth(25);
    this._dialogBox.setHeight(45);
    this._dialogBox.setText(text);

    if (top10) {
      this._dialogBox.setHasInput(true);
      this._dialogBox.setCallback(this.saveBestResult.bind(this));
    }

    this._dialogBox.setHasButton(true);
    this._dialogBox.show();
  }

  saveBestResult(name) {
    const time = this._timer.getTime();
    const moves = this._moveCounter.getMoves();
    const size = `${this._size}x${this._size}`;
    GameAPI.postRecord(name, size, time, moves, this.updateRatingList.bind(this));
  }

  showSolveWindow() {
    this._dialogBox.setWidth(20);
    this._dialogBox.setHeight(10);
    this._dialogBox.setText('Solving puzzle...');
    this._dialogBox.setHasButton(false);
    this._dialogBox.setHasInput(false);
    this._dialogBox.show();
  }

  intersect(tile) {
    const pos = this._tiles2d[0];
    const gap = this._board.getSize() / 100;

    const sx = pos.column * (tile.getWidth() + gap) + this._board.getPosition().x;
    const sy = pos.row * (tile.getWidth() + gap) + this._board.getPosition().y;
    const ex = sx + tile.getWidth();
    const ey = sy + tile.getWidth();

    const tileSX = tile.getRectPos().x;
    const tileSY = tile.getRectPos().y;
    const tileEX = tileSX + tile.getWidth();
    const tileEY = tileSY + tile.getWidth();

    if (tileSX < ex && tileEX > sx && tileEY > sy && tileSY < ey) return true;

    return false;
  }

  updateRatingList() {
    this._ratingTable.loadRating();
  }

  loadGame(yes) {
    if (yes) {
      const json = JSON.parse(localStorage.getItem(`${this._size}x${this._size}`));
      this._gemPuzzle.setTiles2d(json.state);
      this._tiles2d = json.state;
      this._srcImg = json.img;
      this._tiles.forEach((tile) => tile.removeFrom(this._board));
      this._tiles = [];
      this._board.setGrid(this._size);
      this._isWon = false;
      this.createTiles();
      this.updateTilesSize();
      this.updateTilesPosition();
      this._moveCounter.setMoves(json.moves);
      this._timer.setStartTime(json.time);
      this.disableSolveButton(false);
    } else {
      this.removeSavedGame();
    }
  }

  saveGame() {
    const data = {
      state: this._tiles2d,
      moves: this._moveCounter.getMoves(),
      time: this._timer.getTime(),
      img: this._srcImg,
    };
    const params = JSON.stringify(data);
    localStorage.setItem(`${this._size}x${this._size}`, params);
  }

  removeSavedGame() {
    localStorage.removeItem(`${this._size}x${this._size}`);
  }

  newGame() {
    this._gemPuzzle = new GemPuzzle(this._size);
    this._tiles2d = this._gemPuzzle.getTiles2d();
    this._tiles.forEach((tile) => tile.removeFrom(this._board));
    this._tiles = [];
    this._board.setGrid(this._size);
    this._isWon = true;
    this._solve = null;
    this.disableStartButton(false);
    this.createTiles();
    this.updateTilesSize();
    this.updateTilesPosition();

    /* Game continue */
    if (typeof (Storage) !== 'undefined') {
      if (localStorage.getItem(`${this._size}x${this._size}`)) {
        this._dialogBox.setText('<p>The last game has not been completed.</p><p>Do you want to continue?</p>');
        this._dialogBox.setCancelable(true);
        this._dialogBox.setWidth(25);
        this._dialogBox.setHeight(20);
        this._dialogBox.setCallback(this.loadGame.bind(this));
        this._dialogBox.show();
      }
    } else Errors.localStorageSupport();
  }

  solveGame() {
    const seq = ArrayData.convertObj2dToArr(this._tiles2d, this._size);
    const solver = new Solver(seq, this._size);
    const solveStr = solver.getSolve();

    this._solve = solveStr.split(' ');
    this._solve.pop();
    this._dialogBox.hide();
    this.stepByStep(0);
  }

  setParams(size, isSound, isMusic, isNumbers) {
    if (size === 0) {
      if (!this._isWon) this._timer.resumeTimer();
    } else {
      this._isMusic = isMusic;
      this._isSound = isSound;
      this._isNumbers = isNumbers;

      if (this._isMusic) this._music.play();
      else {
        this._music.pause();
        this._music.currentTime = 0;
      }

      this._tiles.forEach((tile) => tile.showNumber(this._isNumbers));

      if (this._size !== size && size !== undefined) {
        this._size = size;
        this._ratingTable.setSize(size);
        this._ratingTable.loadRating();
        this.newGame();
      } else if (!this._isWon) this._timer.resumeTimer();
    }
  }

  disableSolveButton(b) {
    this._solveButton.disabled = b;
    if (b) {
      this._solveButton.classList.add('main_menu-button_disable');
    } else {
      this._solveButton.classList.remove('main_menu-button_disable');
    }
  }

  disableStartButton(b) {
    this._startButton.disabled = b;
    if (b) {
      this._startButton.classList.add('main_menu-button_disable');
    } else {
      this._startButton.classList.remove('main_menu-button_disable');
    }
  }

  stepByStep(n) {
    switch (this._solve[n]) {
      case 'LEFT':
        for (const k in this._tiles2d) {
          if (this._tiles2d[k].row === this._tiles2d[0].row && this._tiles2d[k].column === this._tiles2d[0].column - 1) {
            this._tiles2d[k].column = this._tiles2d[0].column;
            this._tiles2d[0].column = this._tiles2d[k].column - 1;
            break;
          }
        }
        break;
      case 'RIGHT':
        for (const k in this._tiles2d) {
          if (this._tiles2d[k].row === this._tiles2d[0].row && this._tiles2d[k].column === this._tiles2d[0].column + 1) {
            this._tiles2d[k].column = this._tiles2d[0].column;
            this._tiles2d[0].column = this._tiles2d[k].column + 1;
            break;
          }
        }
        break;
      case 'UP':
        for (const k in this._tiles2d) {
          if (this._tiles2d[k].row === this._tiles2d[0].row - 1 && this._tiles2d[k].column === this._tiles2d[0].column) {
            this._tiles2d[k].row = this._tiles2d[0].row;
            this._tiles2d[0].row = this._tiles2d[k].row - 1;
            break;
          }
        }
        break;
      case 'DOWN':
        for (const k in this._tiles2d) {
          if (this._tiles2d[k].row === this._tiles2d[0].row + 1 && this._tiles2d[k].column === this._tiles2d[0].column) {
            this._tiles2d[k].row = this._tiles2d[0].row;
            this._tiles2d[0].row = this._tiles2d[k].row + 1;
            break;
          }
        }
        break;
      default:
        break;
    }

    this.updateTilesPosition();

    setTimeout(() => {
      if (n < this._solve.length) this.stepByStep(n + 1);
      else this.endStepByStep();
    }, 1000);
  }

  endStepByStep() {
    this.disableStartButton(false);
    this._tiles.forEach((tile) => tile.setClickable(true));
  }
}
