import { setAsLastPoint } from './utils';
import { linear } from './samplers';

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
      return (samplers[keys] || linear(keys))(time, state);
    }

    const checkKeys = Array.isArray(keys);

    Object.keys(samplers).forEach((samplerName) => {
      if (!checkKeys || keys.indexOf(samplerName)) {
        ret[samplerName] = samplers[samplerName](time, state, sample);
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
