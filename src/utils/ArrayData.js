export default class ArrayData {
  static createSequence(n) {
    return Array.from({ length: n }, (_, i) => (i + 1) % n);
  }

  static shuffle(v) {
    let n = v.length - 1;

    while (n > 1) {
      const r = ~~(Math.random() * n);
      n -= 1;
      [v[n], v[r]] = [v[r], v[n]];
    }
  }

  static convertTo2D(array, n) {
    const result = [];

    array.forEach((value, index) => {
      const [row, column] = ArrayData.getIndex2D(index, n);

      if (column === 0) result[row] = [];

      result[row].push(value);
    });

    return result;
  }

  static getIndex2D(index, n) {
    const column = index % n;
    const row = ~~(index / n);
    return [row, column];
  }

  static isDefaultSequence(array) {
    if (array[array.length - 1] !== 0) return false;

    for (let i = array.length - 2; i >= 0; i--) if (array[i] !== i + 1) return false;

    return true;
  }

  static convertToObject2D(array, n) {
    const result = {};

    array.forEach((v, i) => {
      const [row, column] = ArrayData.getIndex2D(i, n);
      result[v] = { row, column };
    });

    return result;
  }

  static convertObj2dToArr(obj, n) {
    const result = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        for (const k in obj) {
          if (obj[k].row === r && obj[k].column === c) result.push(Number(k));
        }
      }
    }
    return result;
  }

  static isObjectsEqual(objA, objB) {
    for (const [k, v] of Object.entries(objA)) {
      if (v.column === undefined || objB[k].column === undefined
        || v.row === undefined || objB[k].row === undefined
        || v.column !== objB[k].column
        || v.row !== objB[k].row) return false;
    }

    return true;
  }
}
