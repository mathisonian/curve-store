import { getPointBefore, getPointAfter } from '../utils';

const linear = (name) => {
  return (t, state) => {
    let before = getPointBefore(state[name], t);
    let after = getPointAfter(state[name], t);

    if (before === null) {
      return after.value;
    }

    return before.value + (t - before.time) * (after.value - before.value) / (after.time - before.time);
  };
};

export {
  linear
};
