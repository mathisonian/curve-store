'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integral = exports.derivative = exports.linear = undefined;

var _utils = require('../utils');

var _lodash = require('lodash');

var linear = function linear(name) {
  return function (t, state) {
    var before = (0, _utils.getPointBefore)(state[name], t);
    var after = (0, _utils.getPointAfter)(state[name], t);

    if (before === null) {
      return after.value;
    }

    if (after === null) {
      return before.value;
    }

    return before.value + (t - before.time) * (after.value - before.value) / (after.time - before.time);
  };
};

var derivative = function derivative(name, delta) {
  delta = delta || 0.001;

  return function (t, state, sample) {
    var x1 = void 0;
    var x2 = void 0;
    if ((0, _lodash.isFunction)(name)) {
      x1 = name(t - delta, state, sample);
      x2 = name(t, state, sample);
    } else {
      x1 = sample(t - delta, name);
      x2 = sample(t, name);
    }
    return (x2 - x1) / delta;
  };
};

var integral = function integral(name, delta) {
  delta = delta || 0.01;

  var recursiveIntegral = (0, _lodash.memoize)(function (t, state, sample) {
    if (t === 0) {
      return 0;
    }

    var snapped = (0, _utils.snap)(t, delta);
    if (snapped === t) {
      return delta * (sample(t, name) + sample(t - delta, name)) / 2 + recursiveIntegral(t - delta, state, sample);
    }

    return (t - snapped) * (sample(t, name) + sample(snapped, name)) / 2 + recursiveIntegral(snapped, state, sample);
  });

  return recursiveIntegral;
};

exports.linear = linear;
exports.derivative = derivative;
exports.integral = integral;