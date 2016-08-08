import { getPointBefore, getPointAfter } from '../utils';

const linear = (name) => {
  return (t, state) => {
    let before = getPointBefore(state[name], t);
    let after = getPointAfter(state[name], t);

    if (before === null) {
      return after.value;
    }

    if (after === null) {
      return before.value;
    }

    return before.value + (t - before.time) * (after.value - before.value) / (after.time - before.time);
  };
};

const derivative = (name, delta) => {
  return (t, state, sample) => {
    const delta = delta || 0.0001;

    const x1 = sample(t - delta, name);
    const x2 = sample(t, name);

    return (x2 - x1) / delta;
  };
};

export {
  linear,
  derivative
};
