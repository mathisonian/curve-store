'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _samplers = require('./samplers');

var _lodash = require('lodash.isfunction');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isobject');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.isarray');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var runSampler = function runSampler(sampler, time, state, sample) {
  if ((0, _lodash2.default)(sampler)) {
    return sampler(time, state, sample);
  } else if ((0, _lodash6.default)(sampler)) {
    return sampler.map(function (s) {
      runSampler(s, time, state, sample);
    });
  } else if ((0, _lodash4.default)(sampler)) {
    var _ret = function () {
      var retObj = {};
      Object.keys(sampler).forEach(function (key) {
        retObj[key] = runSampler(sampler[key], time, state, sample);
      });
      return {
        v: retObj
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
};

exports.default = function (samplers) {
  var state = {};

  var clear = function clear() {
    state = {};
  };

  var clearBefore = function clearBefore(t) {
    Object.keys(state).forEach(function (key) {
      state[key] = state[key].filter(function (_ref) {
        var time = _ref.time;
        return time >= t;
      });
    });
  };

  var clearAfter = function clearAfter(t) {
    Object.keys(state).forEach(function (key) {
      state[key] = state[key].filter(function (_ref2) {
        var time = _ref2.time;
        return time <= t;
      });
    });
  };

  var set = function set(time, values) {
    Object.keys(values).forEach(function (key) {
      var val = values[key];
      if (!state.hasOwnProperty(key)) {
        state[key] = [];
      }
      (0, _utils.setAsLastPoint)(state[key], time, val);
    });
  };

  var sample = function sample(time, keys) {
    var ret = {};

    if (typeof keys === 'string') {
      var s = (0, _lodash2.default)(samplers[keys]) ? samplers[keys] : (0, _samplers.linear)(keys);
      return runSampler(s, time, state);
    }

    var checkKeys = (0, _lodash6.default)(keys);

    Object.keys(samplers).forEach(function (samplerName) {
      if (!checkKeys || keys.indexOf(samplerName)) {
        var sampler = samplers[samplerName];
        ret[samplerName] = runSampler(sampler, time, state, sample);
      }
    });
    return ret;
  };

  var getState = function getState() {
    return Object.assign({}, state);
  };

  return {
    set: set,
    clear: clear,
    clearBefore: clearBefore,
    clearAfter: clearAfter,
    sample: sample,
    getState: getState
  };
};