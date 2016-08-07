/*global describe, it */

import expect from 'expect';
import { createStore } from '../src';
import { getPointBefore, getPointAfter } from '../src/utils';

describe('curve-store tests', () => {
  it('should create a new store', () => {
    const store = createStore();
    expect(store).toBeA(Object);
  });

  it('should set a value at t=0', () => {
    const store = createStore();
    store.set({ time: 0, values: { myKey: 'value' } });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 'value' }]
    });
  });

  it('should set a series of values', () => {
    const store = createStore();
    store.set({ time: 0, values: { myKey: 0 } });
    store.set({ time: 1, values: { myKey: 1 } });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 0 }, { time: 1, value: 1 }]
    });
  });
  it('should clear future values', () => {
    const store = createStore();
    store.set({ time: 1, values: { myKey: 1 } });

    store.set({ time: 0, values: { myKey: 0 } });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 0 }]
    });
  });

  it('should get point before correctly', () => {
    const store = createStore();

    store.set({ time: 0, values: { myKey: 0 } });
    store.set({ time: 1, values: { myKey: 1 } });

    const state = store.getState();
    expect(getPointAfter(state.myKey, 0.5)).toEqual({
      time: 1,
      value: 1
    });

  });

  it('should get point after correctly', () => {
    const store = createStore();

    store.set({ time: 0, values: { myKey: 0 } });

    store.set({ time: 1, values: { myKey: 1 } });

    const state = store.getState();
    export(getPointAfter(state.myKey, 0.5)).toEqual({
      time: 1,
      value: 1
    });
  });

  it('should sample values correctly', () => {
    const store = createStore({
      myKey: (t, state) => {
        const before = getPointBefore(state.myKey, t);
        const after = getPointAfter(state.myKey, t);
        return before.value + (t - before.time) * (after.value - before.value) / (after.time - before.time);
      }
    });

    store.set({ time: 0, values: { myKey: 0 } });
    store.set({ time: 1, values: { myKey: 1 } });

    const sample = store.sample(0.5);
    expect(sample).toEqual(0.5);
  });
});
