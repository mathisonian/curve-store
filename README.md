
```js
const sampler = {
  position: (t, state) => {
    const nextPosition = state.position.getPointAfter(t);
    const prevPosition = state.position.getPointBefore(t);

    return [currentX, currentY];
  },

  velocity: (t, state) => {
    const nextPosition = state.position.getPointAfter(t);
    const prevPosition = state.position.getPointBefore(t);

    return calculatedVelocity;
  }
};

const store = createStore(sampler);

store.set({
  time: now() + 1/2 second,
  state: {
    position: [x, y]
  }
});

store.sample(t);
```
