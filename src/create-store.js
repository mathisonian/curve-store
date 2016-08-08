import { setAsLastPoint } from './utils';

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

  const sample = (time) => {
    const sample = {};
    Object.keys(samplers).forEach((samplerName) => {
      sample[samplerName] = samplers[samplerName](time, state);
    });
    return sample;
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
