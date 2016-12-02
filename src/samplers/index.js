import { getPointBefore, getPointAfter, snap } from '../utils';
import isFunction from 'lodash.isfunction';
import memoize from 'lodash.memoize';

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
  delta = delta || 0.001;

  return (t, state, sample) => {
    let x1;
    let x2;
    if (isFunction(name)) {
      x1 = name(t - delta, state, sample);
      x2 = name(t, state, sample);
    } else {
      x1 = sample(t - delta, name);
      x2 = sample(t, name);
    }
    return (x2 - x1) / delta;
  };
};

const integral = (name, delta) => {
  delta = delta || 0.01;

  const recursiveIntegral = memoize((t, state, sample) => {
    if (t === 0) {
      return 0;
    }

    const snapped = snap(t, delta);
    if (snapped === t) {
      return (delta * (sample(t, name) + sample(t - delta, name)) / 2) + recursiveIntegral(t - delta, state, sample);
    }

    return ((t - snapped) * (sample(t, name) + sample(snapped, name)) / 2) + recursiveIntegral(snapped, state, sample);
  });

  return recursiveIntegral;
};

export {
  linear,
  derivative,
  integral
};
