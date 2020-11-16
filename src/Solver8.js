export default class Solver8 {
  constructor() {
    this.hash = {};
    this.values = new Array(1000000);
    this.size = 0;
  }

  move(state, pos, steps) {
    const newState = state.slice();
    Solver8.swap(newState, pos, pos + steps);
    return newState;
  }

  static hashState(state) {
    const stateLength = state.length;
    let hash = 0;
    for (let i = 0; i < stateLength; i++) {
      hash += state[i] * (stateLength ** i);
    }
    return hash;
  }

  getSuccessors(state) {
    let newState;
    let tmpState;
    const successors = [];
    const pos = state.indexOf(0);
    const row = Math.trunc(pos / 3);
    const col = pos % 3;

    if (row > 0) {
      newState = this.move(state, pos, -3);
      if (!Solver8.compare(newState, state.prev)) {
        tmpState = Solver8.hashState(newState);
        if (typeof this.hash[tmpState] === 'undefined') {
          this.hash[tmpState] = newState;
          newState.prev = state;
          successors.push(newState);
        }
      }
    }

    if (col > 0) {
      newState = this.move(state, pos, -1);
      if (!Solver8.compare(newState, state.prev)) {
        tmpState = Solver8.hashState(newState);
        if (typeof this.hash[tmpState] === 'undefined') {
          this.hash[tmpState] = newState;
          newState.prev = state;
          successors.push(newState);
        }
      }
    }

    if (row < 2) {
      newState = this.move(state, pos, 3);
      if (!Solver8.compare(newState, state.prev)) {
        tmpState = Solver8.hashState(newState);
        if (typeof this.hash[tmpState] === 'undefined') {
          this.hash[tmpState] = newState;
          newState.prev = state;
          successors.push(newState);
        }
      }
    }

    if (col < 2) {
      newState = this.move(state, pos, 1);
      if (!Solver8.compare(newState, state.prev)) {
        tmpState = Solver8.hashState(newState);
        if (typeof this.hash[tmpState] === 'undefined') {
          this.hash[tmpState] = newState;
          newState.prev = state;
          successors.push(newState);
        }
      }
    }
    return successors;
  }

  static swap(state, from, to) {
    [state[from], state[to]] = [state[to], state[from]];
  }

  collateStates(i) {
    let _ = this.values[i].prev;
    const result = [this.values[i]];
    while (_) {
      for (let j = 0; j < this.size; j++) {
        if (Solver8.compare(_, this.values[j])) {
          _ = this.values[j].prev;
          result.push(this.values[j]);
          break;
        }
      }
    }
    return result.reverse();
  }

  bfs(state) {
    this.values = new Array(1000000);
    state.prev = null;
    const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    this.values[0] = state;
    this.size += 1;

    for (let i = 0; i < this.size; i++) {
      if (Solver8.compare(goalState, this.values[i])) {
        return this.collateStates(i);
      }
      const tmpSuccessors = this.getSuccessors(this.values[i]);
      for (let k = 0; k < tmpSuccessors.length; k++) {
        this.values[this.size] = tmpSuccessors[k];
        this.size += 1;
      }
    }

    return null;
  }

  static compare(arr1, arr2) {
    if (!arr1 || !arr2) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  static convertToWords(arr) {
    let result = '';
    for (let i = 1; i < arr.length; i++) {
      const cI = arr[i].indexOf(0);
      const cR = Math.trunc(cI / 3);
      const cC = cI % 3;
      const pI = arr[i - 1].indexOf(0);
      const pR = Math.trunc(pI / 3);
      const pC = pI % 3;

      if (cR - pR > 0) result += 'DOWN ';
      if (cR - pR < 0) result += 'UP ';
      if (cC - pC > 0) result += 'RIGHT ';
      if (cC - pC < 0) result += 'LEFT ';
    }
    return result;
  }
}
