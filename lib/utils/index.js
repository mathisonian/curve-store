'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointsBefore = exports.getPointsAfter = exports.getPointBefore = exports.getPointAfter = exports.setAsLastPoint = exports.snap = exports.set = undefined;

var _lodash = require('lodash.sortedindexby');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var set = function set(array, time, value) {
  var arrayObj = { time: time, value: value };
  var index = (0, _lodash2.default)(array, arrayObj, 'time');
  array.splice(index, 0, value);
};

var setAsLastPoint = function setAsLastPoint(array, time, value) {
  var arrayObj = { time: time, value: value };
  var index = (0, _lodash2.default)(array, arrayObj, 'time');
  array.splice(index, array.length - index, arrayObj);
};

var getPointsBefore = function getPointsBefore(array, time, n) {
  var index = (0, _lodash2.default)(array, { time: time }, 'time');
  return array.slice(Math.max(0, index - n), index);
};

var getPointsAfter = function getPointsAfter(array, time, n) {
  var index = (0, _lodash2.default)(array, { time: time }, 'time');
  return array.slice(index, index + n);
};

var getPointBefore = function getPointBefore(array, time) {
  var pointArray = getPointsBefore(array, time, 1);
  return pointArray.length ? pointArray[0] : null;
};

var getPointAfter = function getPointAfter(array, time) {
  var pointArray = getPointsAfter(array, time, 1);
  return pointArray.length ? pointArray[0] : null;
};

var snap = function snap(t, delta) {
  var factor = 1;
  if (delta < 0) {
    factor = 1 / delta;
  }

  var scaledT = factor * t;
  var modT = scaledT % (delta * factor);
  if (modT === 0) {
    return t;
  }

  return (scaledT - modT) / factor;
};

exports.set = set;
exports.snap = snap;
exports.setAsLastPoint = setAsLastPoint;
exports.getPointAfter = getPointAfter;
exports.getPointBefore = getPointBefore;
exports.getPointsAfter = getPointsAfter;
exports.getPointsBefore = getPointsBefore;