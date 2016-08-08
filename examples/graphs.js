// Import libraries
import { createStore } from '../src';
import { getPointAfter, getPointBefore } from '../src/utils';
import { linear } from '../src/interpolators';
import raf from 'raf';

// Boilerplate Setup
const size = 100;
let time = 0;
document.body.style.padding = 0;
document.body.style.margin = 0;
const width = window.innerWidth;
const height = window.innerHeight;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
canvas.style.display = 'block';
document.body.appendChild(canvas);
const context = canvas.getContext('2d');

const linearDerivative = (name) => {
  return (t, state) => {
    let before = getPointBefore(state[name], t);
    let after = getPointAfter(state[name], t);

    if (before === null || after === null) {
      return 0;
    }

    return (after.value - before.value) / (after.time - before.time);
  }
}

// The start of the interesting part
const store = createStore({
  x: linear('x'),
  y: linear('y'),
  dx: linearDerivative('x'),
  dy: linearDerivative('y')
});

store.set(time, {
  x: (width - size) / 2,
  y: (height - size) / 2
});

canvas.onmousemove = (e) => {
  store.set(time, store.sample(time));
  store.set(time + 400, {
    x: e.clientX - size / 2,
    y: e.clientY - size / 2
  })
};

raf(function tick (t) {
  time = t;
  const { x, y, dx, dy } = store.sample(time);
  context.clearRect(0, 0, width, height);

  const count = 16;
  for (var i = count - 1; i >= 0; i--) {
    context.fillStyle = `rgba(145, 117, 240, ${1 - i / count})`;
    context.fillRect(x - i * 11 * dx, y - i * 11 * dy, size, size);
  }

  raf(tick);
});
