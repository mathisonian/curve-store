/*global describe, it */

import expect from 'expect';
import { createStore } from '../src';
import { getPointBefore, getPointAfter, snap } from '../src/utils';
import { linear, derivative, integral } from '../src/samplers';

const epsilon = 0.00001;

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

  it('should get derivative correctly', () => {
    const store = createStore({
      d: derivative('myKey')
    });

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    let sample = store.sample(0.5);
    expect(Math.abs(sample.d - 1)).toBeLessThan(epsilon);
  });

  it('should get the second derivative correctly', () => {
    const store = createStore({
      d: derivative(derivative('myKey'))
    });

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    let sample = store.sample(0.5);
    expect(sample).toEqual({ d: 0 });
  });

  it('should snap to a value correctly', () => {
    const t = 0.015;
    const s = snap(t, 0.01);
    expect(s).toEqual(0.01);
  });

  it('should snap to a presnapped value correctly', () => {
    const t = 0.01;
    const s = snap(t, 0.01);
    expect(s).toEqual(0.01);
  });

  it('should compute an integral correctly', () => {
    const store = createStore({
      i: integral('myKey')
    });

    store.set(0, { myKey: 0 });
    store.set(1, { myKey: 1 });

    let sample = store.sample(0.25);
    expect(Math.abs(sample.i - 0.03125)).toBeLessThan(epsilon);

    sample = store.sample(0.5);
    expect(Math.abs(sample.i - 0.125)).toBeLessThan(epsilon);

    sample = store.sample(1);
    expect(Math.abs(sample.i - 0.5)).toBeLessThan(epsilon);
  });
});
