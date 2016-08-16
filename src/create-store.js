import { setAsLastPoint } from './utils';
import { linear } from './samplers';
import { isArray, isObject, isFunction } from 'lodash';

const runSampler = (sampler, time, state, sample) => {
  if (isFunction(sampler)) {
    return sampler(time, state, sample);
  } else if (isArray(sampler)) {
    return sampler.map((s) => { runSampler(s, time, state, sample); });
  } else if (isObject(sampler)) {
    const retObj = {};
    Object.keys(sampler).forEach((key) => {
      retObj[key] = runSampler(sampler[key], time, state, sample);
    });
    return retObj;
  }
};

export default (samplers) => {
  const state = {};

  const set = (time, values) => {
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (!state.hasOwnProperty(key)) {
        state[key] = [];
      }
      setAsLastPoint(state[key], time, val);
    });
  };

  const sample = (time, keys) => {
    const ret = {};

    if (typeof keys === 'string') {
      const s = isFunction(samplers[keys]) ? samplers[keys] : linear(keys);
      return runSampler(s, time, state);
    }

    const checkKeys = isArray(keys);

    Object.keys(samplers).forEach((samplerName) => {
      if (!checkKeys || keys.indexOf(samplerName)) {
        const sampler = samplers[samplerName];
        ret[samplerName] = runSampler(sampler, time, state, sample);
      }
    });
    return ret;
  };

  const getState = () => {
    return Object.assign({}, state);
  };

  return {
    set,
    sample,
    getState
  };
};
