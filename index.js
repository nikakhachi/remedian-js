// Copyright 2022 Vladyslav Moisieienkov

/**
 * Main file that contains implementation of remedian algorithm.
 *
 * @author VMois (Vladyslav Moisieienkov)
 */

class Remedian {
  /**
     * Create an instance of an algorithm.
     * @param {number} bufferSize - size of a single buffer.
     */
  constructor(bufferSize) {
    this.bufferSize = bufferSize;
    this.buffers = [];
  }

  _createBuffer() {
    if (this.i > this.buffers.length - 1) {
      const newBuffer = new Array(this.bufferSize);
      newBuffer.fill(undefined);
      Object.seal(newBuffer);
      this.buffers.push(newBuffer);
    }
  }

  _isCurrentBufferFull() {
    const array = this.buffers[this.i];
    return array[array.length - 1] != undefined;
  }

  /**
     * Check if buffer is empty
     * @param {number} position - buffer number to check.
     * @return {boolean} true if buffer is empty, false if not.
     */
  _bufferEmpty(position) {
    const array = this.buffers[position];
    for (let j = 0; j < array.length; j++) {
      if (array[j] != undefined) {
        return false;
      }
    }
    return true;
  }

  /**
     * Insert number into the current buffer if it has a free space.
     * @param {number} number - number to insert into the buffer.
     * @return {boolean} return if current buffer is full after insertion
     */
  _insertIntoBuffer(number) {
    const array = this.buffers[this.i];
    let freePosition = -1;
    for (let j = 0; j < array.length; j++) {
      if (array[j] == undefined) {
        freePosition = j;
        break;
      }
    }
    if (freePosition >= 0) {
      array[freePosition] = number;
    }
    return this._isCurrentBufferFull();
  }

  _calculateCurrentBufferMedian() {
    const array = this.buffers[this.i];
    const sorted = Array.from(array).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }

  /**
     * Calculate weighted median.
     * @param {array} values - numbers.
     * @param {array} weights - weights associated with numbers.
     * @return {number} weighted median
     */
  _weightedMedian(values, weights) {
    const sortedValues = [];
    const sortedWeights = [];

    values.map((value, i) => {
      return [value, weights[i]];
    }).sort((a, b) => {
      return a[0] - b[0];
    }).map((pair) => {
      sortedValues.push(pair[0]);
      sortedWeights.push(pair[1]);
    });

    const S = sortedWeights.reduce((partialSum, a) => partialSum + a, 0);

    let k = 0;
    let sum = S - sortedWeights[0];

    while (sum > S/2) {
      ++k;
      sum -= sortedWeights[k];
    }

    if (Math.round(sum) == S/2) {
      return (sortedValues[k] + sortedValues[k+1])/2;
    } else {
      return sortedValues[k];
    }
  }

  /**
     * Clear current buffer.
     */
  _clearCurrentBuffer() {
    const array = this.buffers[this.i];
    for (let j = 0; j < array.length; j++) {
      array[j] = undefined;
    }
  }

  /**
     * Decide whatever to calculate weighted median. if buffers are not empty.
     * @return {boolean} true if should calculate weighted median, false if not.
     */
  _shouldCalculateWeightedMedian() {
    for (let j = 0; j < this.buffers.length - 1; j++) {
      if (!this._bufferEmpty(j)) {
        return true;
      }
    }
    return this.buffers[this.i][1] != undefined;
  }

  _getValuesFromBuffer(position) {
    const values = [];
    const array = this.buffers[position];
    for (let j = 0; j < array.length; j++) {
      if (array[j] != undefined) {
        values.push(array[j]);
      }
    }
    return values;
  }

  /**
     * Calculate approximate median.
     * @return {number} approximate median.
     */
  getMedian() {
    if (this.buffers.length == 0) {
      return undefined;
    }

    if (this._shouldCalculateWeightedMedian()) {
      const values = [];
      const weights = [];
      for (let j = 0; j < this.buffers.length; j++) {
        const bufferValues = this._getValuesFromBuffer(j);
        const bufferWeights = new Array(bufferValues.length);
        bufferWeights.fill(this.buffer_size**j);
        values.push(...bufferValues);
        weights.push(...bufferWeights);
      }
      return this._weightedMedian(values, weights);
    } else {
      return this.buffers[this.i][0];
    }
  }

  /**
     * Add a new number to a set from which median will be approximated.
     * @param {number} number - value to add.
     */
  write(number) {
    this.i = 0;
    if (this.buffers.length == 0) {
      this._createBuffer();
    }
    while (this._insertIntoBuffer(number)) {
      number = this._calculateCurrentBufferMedian();
      this._clearCurrentBuffer();
      this.i += 1;
      this._createBuffer();
    }
  }
}

module.exports = Remedian;
