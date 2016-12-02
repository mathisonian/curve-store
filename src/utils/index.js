import sortedIndexBy from 'lodash.sortedindexby';

const set = (array, time, value) => {
  const arrayObj = { time, value };
  const index = sortedIndexBy(array, arrayObj, 'time');
  array.splice(index, 0, value);
};

const setAsLastPoint = (array, time, value) => {
  const arrayObj = { time, value };
  const index = sortedIndexBy(array, arrayObj, 'time');
  array.splice(index, array.length - index, arrayObj);
};

const getPointsBefore = (array, time, n) => {
  const index = sortedIndexBy(array, { time }, 'time');
  return array.slice(Math.max(0, index - n), index);
};

const getPointsAfter = (array, time, n) => {
  const index = sortedIndexBy(array, { time }, 'time');
  return array.slice(index, index + n);
};

const getPointBefore = (array, time) => {
  const pointArray = getPointsBefore(array, time, 1);
  return pointArray.length ? pointArray[0] : null;
};

const getPointAfter = (array, time) => {
  const pointArray = getPointsAfter(array, time, 1);
  return pointArray.length ? pointArray[0] : null;
};

const snap = (t, delta) => {
  let factor = 1;
  if (delta < 0) {
    factor = 1 / delta;
  }

  const scaledT = factor * t;
  const modT = scaledT % (delta * factor);
  if (modT === 0) {
    return t;
  }

  return (scaledT - modT) / factor;
};

export {
  set,
  snap,
  setAsLastPoint,
  getPointAfter,
  getPointBefore,
  getPointsAfter,
  getPointsBefore
};
