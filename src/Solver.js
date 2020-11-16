export default class Solver {
  constructor(array, size) {
    this.array = [...array];
    this.size = size;
    this.direction = ['RIGHT', 'LEFT', 'DOWN', 'UP'];
    this.ans = [];
    this.result = '';

    this.solve();
  }

  getDistance(x, y) {
    const a = Math.abs(~~((this.array[x * this.size + y] - 1) / this.size) - x);
    const b = Math.abs(((this.array[x * this.size + y] - 1) % this.size) - y);
    return a + b;
  }

  getDFS(cur, h, x, y, dep) {
    if (cur + h > dep) return 0;

    if (!h) {
      for (let i = 0; i < cur; ++i) this.result += `${this.direction[this.ans[i]]} `;

      return 1;
    }

    const dx = [0, 0, 1, -1];
    const dy = [1, -1, 0, 0];

    for (let i = 0, tx, ty; i < this.size; ++i) {
      tx = x + dx[i];
      ty = y + dy[i];

      if (Math.min(tx, ty) >= 0 && Math.max(tx, ty) < this.size) {
        if (!cur || i !== (this.ans[cur - 1] ^ 1)) {
          this.ans[cur] = i;
          const t = this.getDistance(tx, ty);
          const ai = x * this.size + y;
          const ti = tx * this.size + ty;

          [this.array[ai], this.array[ti]] = [this.array[ti], this.array[ai]];

          if (this.getDFS(cur + 1, h - t + this.getDistance(x, y), tx, ty, dep)) return 1;

          [this.array[ai], this.array[ti]] = [this.array[ti], this.array[ai]];
        }
      }
    }

    return 0;
  }

  getSolve() {
    return this.result;
  }

  solve() {
    let h = 0;
    let inv = 0;
    let sx;
    let sy;

    for (let z = 0; z < this.array.length; z++) {
      const x = ~~(z / this.size);
      const y = z % this.size;

      if (this.array[z]) {
        h += this.getDistance(x, y);

        for (let i = (x << 2) | y, j = 0; j < i; ++j) {
          inv += this.array[j] > this.array[z];
        }
      } else {
        sx = x;
        sy = y;
      }
    }

    if ((inv + sx) & 1) {
      for (let dep = h; !this.getDFS(0, h, sx, sy, dep);) dep += 1;
    } else {
      // Puzzle not solved and return null
      this.result = null;
    }
  }
}
