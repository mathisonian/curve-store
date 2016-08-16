// Import libraries
import { createStore } from '../src';
import { linear, derivative } from '../src/samplers';
import raf from 'raf';

// Boilerplate Setup
const size = 100;
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

// The start of the interesting part
let time = 0;
const store = createStore({
  x: linear('x'),
  y: linear('y'),
  dx: derivative('x'),
  dy: derivative('y')
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
  });
};

raf(function tick (t) {
  time = t;
  const { x, y, dx, dy } = store.sample(time);
  context.clearRect(0, 0, width, height);

  const count = 6;
  for (var i = count - 1; i >= 0; i--) {
    context.fillStyle = `rgba(145, 117, 240, ${1 - i / count})`;
    context.fillRect(x - i * 33 * dx, y - i * 33 * dy, size, size);
  }

  raf(tick);
});
