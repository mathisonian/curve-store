/*global describe, it */

import expect from 'expect';
import { createStore } from '../src';
import { getPointBefore, getPointAfter } from '../src/utils';
import { linear } from '../src/interpolators';

describe('curve-store tests', () => {
  it('should create a new store', () => {
    const store = createStore();
    expect(store).toBeA(Object);
  });

  it('should set a value at t=0', () => {
    const store = createStore();
    store.set(0, { myKey: 'value' });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 'value' }]
    });
  });

  it('should set a series of values', () => {
    const store = createStore();
    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 0 }, { time: 1, value: 1 }]
    });
  });
  it('should clear future values', () => {
    const store = createStore();
    store.set(1, { myKey: 1 });

    store.set(0, { myKey: 0 });

    expect(store.getState()).toEqual({
      myKey: [{ time: 0, value: 0 }]
    });
  });

  it('should get point before correctly', () => {
    const store = createStore();

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    const state = store.getState();
    expect(getPointBefore(state.myKey, 0.5)).toEqual({
      time: 0,
      value: 0
    });
  });

  it('should get point after correctly', () => {
    const store = createStore();

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    const state = store.getState();
    expect(getPointAfter(state.myKey, 0.5)).toEqual({
      time: 1,
      value: 1
    });
  });

  it('should linearly sample values correctly between points', () => {
    const store = createStore({
      myKey: linear('myKey')
    });

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    let sample = store.sample(0.25);
    expect(sample).toEqual({ myKey: 0.25 });

    sample = store.sample(0.5);
    expect(sample).toEqual({ myKey: 0.5 });

    sample = store.sample(0.75);
    expect(sample).toEqual({ myKey: 0.75 });
  });

  it('should sample values correctly at points', () => {
    const store = createStore({
      myKey: linear('myKey')
    });

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    let sample = store.sample(0);
    expect(sample).toEqual({ myKey: 0 });

    sample = store.sample(1);
    expect(sample).toEqual({ myKey: 1 });
  });
});
