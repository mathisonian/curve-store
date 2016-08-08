import sortedIndex from 'lodash.sortedindexby';

const set = (array, time, value) => {
  const arrayObj = { time, value };
  const index = sortedIndex(array, arrayObj, 'time');
  array.splice(index, 0, value);
};

const setAsLastPoint = (array, time, value) => {
  const arrayObj = { time, value };
  const index = sortedIndex(array, arrayObj, 'time');
  array.splice(index, array.length - index, arrayObj);
};

const getPointsBefore = (array, time, n) => {
  const index = sortedIndex(array, { time }, 'time');
  return array.slice(Math.max(0, index - n), index);
};

const getPointsAfter = (array, time, n) => {
  const index = sortedIndex(array, { time }, 'time');
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

export {
  set,
  setAsLastPoint,
  getPointAfter,
  getPointBefore,
  getPointsAfter,
  getPointsBefore
};
