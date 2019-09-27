import {range} from './itools';

/**
 * Matrix2D is an implementation of a 2 dimensional matrix
 * where x are index for column and y for lines
 * But instead of working with array in array the matrix is stored in one array :
 * 
 * ```
 * [   x0 x1 x2
 *   y0 0, 1, 2,
 *   y1 3, 4, 5,
 *   y2 6, 7, 8,
 * ]
 * ```
 * instead of 
 * ```
 * [    y0 y1 y2
 *   x0 [0, 3, 6],
 *   x1 [1, 4, 7],
 *   x2 [2, 5, 8],
 * ]
 * ```
 */
export default class Matrix2D {
  constructor(x, y, _data=Array(x * y).fill(null)) {
    this.xSize = x;
    this.ySize = y;
    this.data = _data;
  }

  // --- *** get / set *** --- //

  get(x, y) {
    return this.data[this.linear(x, y)];
  }

  /// gen new matrix with value setted to x, y
  set(x, y, value) {
    const index = this.linear(x, y);

    return new Matrix2D(this.xSize, this.ySize, [
      ...this.data.slice(0, index),
      value,
      ...this.data.slice(index + 1)
    ])
  }

  mSet(x, y, value) {
    this.data[this.linear(x, y)] = value;

    return this;
  }

  // --- *** key computing *** --- //

  linear(x, y) {
    return x + (this.xSize * y);
  }

  // linearIndex = x + (this.xSize * y)
  // y = Math.trunc(linearIndex / this.xSize)
  // x = linearIndex - (this.xSize * y)
  /**
   * @param {number} linearIndex
   * @returns {[*, *]} [x, y]
   */
  key(linearIndex) {
    const y = Math.trunc(linearIndex / this.xSize);
    const x = linearIndex - (this.xSize * y);

    return [x, y]
  }

  // --- *** iteration *** --- //

  *[Symbol.iterator] () {
    for (const x of range({stop: this.xSize})) {
      for (const y of range({stop: this.ySize})) {
        const linear = this.linear(x, y);

        yield [this.data[linear], linear, x, y];
      }
    }
  }

  forEach(callback) {
    for (const [value, linear, x, y] of this) {
      callback(value, linear, x, y);
    }
  }

  // --- *** Factory Matrix2D *** --- //

  static selfDescribe(x, y) {
    return new Matrix2D(x, y).map((_, linear, x, y) => [x, y, linear]);
  }

  map(callback) {
    return new Matrix2D(
      this.xSize,
      this.ySize,
      this.data.map((value, linear) => callback(value, linear, ...this.key(linear)))
    );
  }

  clone() {
    return this.map(v => v);
  }

  bound(xa, ya, xb, yb) {
    return new Matrix2D(
      xb - xa,
      yb - ya,
      this.data.reduce((data, value, linear) => {
        const [x, y] = this.key(linear);

        if (x >= xa && x <= xb && y >= ya && y <= yb) {
          data.push(value);
        }

        return data;
      }, [])
    );
  }

  getRow(y) {
    return this.bound(0, y, this.xSize, y).data;
  }

  getColumn(x) {
    return this.bound(x, 0, x, this.ySize).data;
  }
}

Matrix2D.prototype.imSet = Matrix2D.prototype.set;