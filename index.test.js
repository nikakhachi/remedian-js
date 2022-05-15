// Copyright 2022 Vladyslav Moisieienkov

/**
 * Test file for remedian algorithm
 *
 * @author VMois (Vladyslav Moisieienkov)
 */

const Remedian = require('./index');


describe('Weighted median function', () => {
  test.each([
    [
      [7, 1, 2, 4, 10],
      [1, 1/3, 1/3, 1/3, 1],
      7,
    ],
    [
      [7, 1, 2, 4, 10],
      [1, 1, 1, 1, 1],
      4,
    ],
    [
      [7, 1, 2, 4, 10, 15],
      [1, 1/3, 1/3, 1/3, 1, 1],
      8.5,
    ],
    [
      [1, 2, 4, 7, 10, 15],
      [1/3, 1/3, 1/3, 1, 1, 1],
      8.5,
    ],
    [
      [0, 10, 20, 30],
      [30, 191, 9, 0],
      10,
    ],
    [
      [1, 2, 3, 4, 5],
      [10, 1, 1, 1, 9],
      2.5,
    ],
    [
      [30, 40, 50, 60, 35],
      [1, 3, 5, 4, 2],
      50,
    ],
    [
      [2, 0.6, 1.3, 0.3, 0.3, 1.7, 0.7, 1.7, 0.4],
      [2, 2, 0, 1, 2, 2, 1, 6, 0],
      1.7,
    ],
  ])(
      `should return proper weighted median when passed arguments are: %s, %s`,
      (values, weights, median) => {
        const remedian = new Remedian(3);
        expect(remedian._weightedMedian(values, weights)).toEqual(median);
      },
  );
});

describe('Remedian algorithm implementation correctness', () => {
  test('first buffer is created only when first number is added', () => {
    const remedian = new Remedian(3);
    expect(remedian.buffers.length).toEqual(0);
    remedian.write(1);
    expect(remedian.buffers.length).toEqual(1);
  });

  test(`when current buffer is full, new buffer is created with correct median`, () => {
    const remedian = new Remedian(3);
    remedian.write(1);
    remedian.write(2);
    expect(remedian.buffers.length).toEqual(1);
    remedian.write(3);
    expect(remedian.buffers.length).toEqual(2);

    // median of (1,2,3) is 2, and should be placed in a new buffer
    expect(remedian.buffers[1][0]).toEqual(2);
  });
});
